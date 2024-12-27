import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { CardTitleComponent } from '../../shared/component/card-title/card-title.component';
import { ComparisonMetrics } from '../../shared/models/comparison.interface';
import {
  PERIOD,
  TimePeriodComponent,
} from '../../shared/component/time-period/time-period.component';

@Component({
  selector: 'app-historical',
  standalone: true,
  imports: [CardTitleComponent, TimePeriodComponent],
  templateUrl: './exchange-rate-historical.component.html',
})
export class ExchangeRateHistoricalComponent
  implements AfterViewInit, OnChanges
{
  @Input()
  metrics: ComparisonMetrics[];
  @Input()
  selection: string[];
  @Input()
  baseCode: string;
  @Input()
  period: PERIOD;
  @ViewChild('lineChart')
  lineChart: ElementRef<HTMLDivElement>;
  @Output()
  onPeriodClick = new EventEmitter<PERIOD>();

  svg: d3.Selection<SVGGElement, unknown, null, undefined>;

  createLineChart(
    element: HTMLDivElement,
    quotes: ComparisonMetrics[],
    selection: string[],
    firstTime: Boolean,
    period: PERIOD,
  ) {
    const margin = { top: 30, bottom: 30, left: 55, right: 48 },
      width = element.clientWidth - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    if (firstTime) {
      this.svg = d3
        .select(element)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    } else this.svg.selectAll('*').remove();

    const parseDate = d3.timeParse('%Y-%m-%d');
    const x = d3
      .scaleTime()
      .domain(d3.extent(quotes, (d) => d3.isoParse(d.date)))
      .range([0, width]);

    this.svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(period === '1M' ? d3.timeWeek.every(1) : d3.timeDay.every(1))
          .tickFormat(d3.timeFormat('%b %d, %Y')),
      );

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(quotes, (d: ComparisonMetrics) => {
          const exchangeRates = Object.values(d).filter(
            (value) => typeof value === 'number',
          ) as number[];
          return Math.min(...exchangeRates);
        }),
        d3.max(quotes, (d: ComparisonMetrics) => {
          const exchangeRates = Object.values(d).filter(
            (value) => typeof value === 'number',
          ) as number[];
          return Math.max(...exchangeRates);
        }),
      ])
      .range([height, 0]);
    this.svg.append('g').call(d3.axisLeft(y));

    const color = ['#23395d', '#84b067', '#f1c338'];

    selection.forEach((key, index) => {
      const line: any = d3
        .line()
        .x((d) => {
          const value = d as any;
          return x(d3.isoParse(value.date));
        })
        .y((d) => {
          return y(d[key]);
        });
      this.svg
        .append('path')
        .data([quotes])
        .attr('class', 'line')
        .attr('stroke', color[index])
        .attr('fill', 'none')
        .attr('d', line)
        .attr('stroke-width', 3);

      const legendMargin = (index + 1) * 18;

      this.svg
        .append('circle')
        .attr('cx', width - 64)
        .attr('cy', legendMargin)
        .attr('r', 6)
        .style('fill', color[index]);

      this.svg
        .append('text')
        .attr('x', width - 40)
        .attr('y', legendMargin)
        .text(selection[index])
        .style('font-size', '15px')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .style('fill', 'black');
    });

    this.svg
      .selectAll('g.tick text')
      .style('font-size', '11px')
      .style('font-weight', 'bold');

    this.svg
      .selectAll('domain')
      .style('stroke-width', '1')
      .style('stoke', 'e8e8e8');

    this.lineChart.nativeElement.scrollIntoView();
  }

  ngAfterViewInit(): void {
    this.createLineChart(
      this.lineChart.nativeElement,
      this.metrics,
      this.selection,
      true,
      this.period,
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('metrics' in changes && !changes['metrics'].isFirstChange()) {
      this.createLineChart(
        this.lineChart.nativeElement,
        changes['metrics'].currentValue,
        this.selection,
        false,
        this.period,
      );
    }
  }
}
