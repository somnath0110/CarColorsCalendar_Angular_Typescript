import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment-business-days';

import IProductionDay from '../../models/iproduction-day.model';
import ProductionDay from '../../models/production-day.model';

import { DEFAULT_DATE_FORMAT, FIRST_DAY_OF_PRODUCTION } from '../../config/product.config';
import getCurrentDateMMDDYYYY from '../../util/current-date.util';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  currentMonth: number;
  currentYear: number;
  monthMomentDays: moment.Moment[] = [];
  days: IProductionDay[] = [];
  offCount = 0;
  calendarTitle: string = '';
  productionStartOn: moment.Moment;
  colorIndex: number;
  systemMonth: number;
  systemYear: number;

  @Input() colorsSeq: string[];
  @Input() holidays: string[];

  constructor() {
    this.systemMonth = this.currentMonth = new Date().getMonth() + 1;
    this.systemYear = this.currentYear = new Date().getFullYear();
    this.productionStartOn = moment(FIRST_DAY_OF_PRODUCTION);
    this.colorIndex = -1;
  }

  ngOnInit() {
    moment.updateLocale('us', {
      holidays: this.holidays,
      holidayFormat: DEFAULT_DATE_FORMAT
    });
    this.setCalendar();
  }

  private setCalendar() {
    let monthStr = this.currentMonth > 9 ? this.currentMonth : '0' + this.currentMonth;
    this.calendarTitle = moment(monthStr + '-01-' + this.currentYear).format('MMM - YYYY');
    this.monthMomentDays = moment(monthStr + '-01-' + this.currentYear).monthNaturalDays();
    this.days = [];
    this.offCount = 0;

    for (let i = 0; i < this.monthMomentDays.length; i++) {
      if (i == 0) {
        let diff = moment(this.monthMomentDays[i], DEFAULT_DATE_FORMAT).businessDiff(moment(this.productionStartOn, DEFAULT_DATE_FORMAT));
        let holidaysCount = 0;
        for (let j = 0; j < this.holidays.length; j++) {
          if (moment(this.holidays[j], DEFAULT_DATE_FORMAT).isBetween(moment(this.productionStartOn, DEFAULT_DATE_FORMAT),
            moment(this.monthMomentDays[i], DEFAULT_DATE_FORMAT), 'days')) {
            holidaysCount++;
          }
        }
        this.colorIndex = (diff - holidaysCount) % this.colorsSeq.length;
      }
      let dayObj = new ProductionDay();
      dayObj.day = this.monthMomentDays[i].format("ddd");
      dayObj.date = this.monthMomentDays[i].format("DD");
      dayObj.isProdDay = this.monthMomentDays[i].isBusinessDay();

      let diff = this.monthMomentDays[i].diff(this.productionStartOn, 'days');
      if (diff < 0) {
        dayObj.isPastday = true;
      }

      if (!dayObj.isProdDay) {
        if (this.monthMomentDays[i].isHoliday()) {
          dayObj.isHoliday = true;
          dayObj.isWeekOff = false;
        } else {
          dayObj.isHoliday = false;
          dayObj.isWeekOff = true;
        }
        this.offCount++;
      } else {
        dayObj.color = this.colorsSeq[this.colorIndex];
        this.colorIndex++;
        if (this.colorIndex === this.colorsSeq.length) {
          this.colorIndex = 0;
        }
      }
      this.days.push(dayObj);
    }
  }

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 1) {
      this.currentMonth = 12;
      this.currentYear--;
    }
    this.setCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 12) {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.setCalendar();
  }

  nextYear() {
    this.currentYear++;
    this.setCalendar();
  }

  previousYear() {
    this.currentYear--;
    this.setCalendar();
  }

  isToday(day: string) {
    let cDate = getCurrentDateMMDDYYYY();
    let pDate = moment(this.currentMonth + '-' + parseInt(day) + '-' + this.currentYear).format(DEFAULT_DATE_FORMAT);
    if (cDate == pDate)
      return true;
    else
      return false;
  }
}
