import { Params } from '@angular/router';
import { PeriodAnalyses } from '../interfaces/fund';

export class DateUtils {
  static dateToQuarter(date: Date): string {
    return (
      'Q' + Math.floor((date.getMonth() + 3) / 3) + '-' + date.getFullYear()
    );
  }

  static buildYearsParams(
    params,
    d,
    fundList,
    projection,
    enddate,
    updateYearsByActuals = false
  ) {
    let yearsFrom = this.getYearValues(
      params,
      'From',
      new Date(projection.startDate),
      params.yearsTo ? new Date(params.yearsTo) : new Date(enddate),
      fundList
    );
    let yearsTo = this.getYearValues(
      params,
      'To',
      params.yearsFrom
        ? new Date(params.yearsFrom)
        : new Date(projection.startDate),
      new Date(enddate),
      fundList
    );

    let applyYearFromProjection = true;
    let applyYearToProjection = true;

    if (params.yearsFrom) {
      let filteredYearFrom = yearsFrom.find(
        (a) => a.value === params.yearsFrom
      );
      if (filteredYearFrom) {
        applyYearFromProjection = false;
      } else {
        let foundDate = false;
        yearsFrom.forEach((year) => {
          let findY = year.children.find((y) => y.value === params.yearsFrom);
          if (findY) foundDate = true;
        });
        if (foundDate) applyYearFromProjection = false;
      }
    }
    if (params.yearsTo) {
      let filteredYearTo = yearsTo.find((a) => a.value === params.yearsTo);
      if (filteredYearTo) {
        applyYearToProjection = false;
      } else {
        let foundDate = false;
        yearsTo.forEach((year) => {
          let findY = year.children.find((y) => y.value === params.yearsTo);
          if (findY) foundDate = true;
        });
        if (foundDate) applyYearToProjection = false;
      }
    }

    if (updateYearsByActuals) {
      applyYearFromProjection = true;
      applyYearToProjection = true;
    }

    if (params.actual == 1) {
      if (applyYearFromProjection) {
        params.yearsFrom = this.getFormatDate(
          params,
          projection.startDate,
          fundList
        );
      }
      if (applyYearToProjection) {
        params.yearsTo = this.getFormatDate(
          params,
          projection.midDate ? projection.midDate : projection.startForecast,
          fundList,
          1
        );
      }
    }

    if (params.actual == 2) {
      if (applyYearFromProjection) {
        params.yearsFrom = this.getFormatDate(
          params,
          projection.midDate ? projection.midDate : projection.startForecast,
          fundList
        );
      }

      if (enddate && applyYearToProjection)
        params.yearsTo = this.getFormatDate(params, enddate, fundList, 1);
    }

    if (params.actual == 3) {
      if (applyYearFromProjection) {
        params.yearsFrom = this.getFormatDate(
          params,
          projection.startDate,
          fundList
        );
      }

      if (enddate && applyYearToProjection)
        params.yearsTo = this.getFormatDate(params, enddate, fundList);
    }
  }

  static getFormatDate(params, d, fundList, daysToRemove = null) {
    d = new Date(d);

    if (daysToRemove) d = this.removeDays(d, daysToRemove);

    d = d.getFullYear() + '-' + this.getMonth(params, d, fundList) + '-01';
    return d;
  }

  static removeDays(d, daysToRemove) {
    d.setDate(d.getDate() - daysToRemove);
    return d;
  }

  static convertStringDateToDateUTC(strDate): Date {
    if (strDate) {
      let copyYearsFrom = new Date(strDate);
      let offsetHours = copyYearsFrom.getTimezoneOffset() * 60000;
      if (offsetHours > 0) {
        return new Date(copyYearsFrom.getTime() + offsetHours);
      } else if (offsetHours < 0) {
        return new Date(copyYearsFrom.getTime() - offsetHours);
      }
    } else {
      return null;
    }
  }

  static getMonth(params, d, fundList) {
    let month = d.getMonth() + 1;
    let fund = fundList.find((f) => f.id === Number(params.fund));
    if (fund && fund.dataPeriodAnalyses === PeriodAnalyses.MONTH) {
      return month;
    } else {
      return month < 4 ? 1 : month < 7 ? 4 : month < 10 ? 7 : 10;
    }
  }

  static getYearValues(params: Params, type, startDate, endDate, fundList) {
    let labelValueYears = [];
    let childs = [];

    let fund = fundList.find((f) => f.id === Number(params.fund));

    if (fund && fund.dataPeriodAnalyses === PeriodAnalyses.MONTH) {
      for (
        let date = startDate;
        date <= endDate;
        date.setMonth(date.getMonth() + 1)
      ) {
        let year = startDate.getFullYear();
        let month = date.getMonth() + 1;
        childs.push({
          label: type + ' ' + month + '-' + year,
          value: year + '-' + month + '-01',
        });

        if (
          date.getMonth() === 11 ||
          (month === endDate.getMonth() + 1 && year === endDate.getFullYear())
        ) {
          labelValueYears.push({
            label: year,
            value: year + '-' + '1-01',
            children: childs,
          });
          childs = [];
          year++;
        }
      }
    } else {
      for (
        let date = startDate;
        date < endDate;
        date.setMonth(date.getMonth() + 3)
      ) {
        let year = startDate.getFullYear();
        let quarter =
          date.getMonth() == 0
            ? '-Q1'
            : date.getMonth() == 3
            ? '-Q2'
            : date.getMonth() == 6
            ? '-Q3'
            : '-Q4';
        let month = date.getMonth() + 1;
        childs.push({
          label: type + ' ' + year + quarter,
          value: year + '-' + month + '-01',
        });
        if (
          date.getMonth() == 9 ||
          (date.getYear() === endDate.getYear() &&
            date.getMonth() == endDate.getMonth() - 3)
        ) {
          let path = '1-01';
          if (type == 'To') path = '10-01';
          labelValueYears.push({
            label: year,
            value: year + '-' + path,
            children: childs,
          });
          childs = [];
          year++;
        }
      }
    }
    return labelValueYears;
  }

  static containsDashboardPeriodConfig(url, sessionService) {
    let splitRoute = url.split('/');
    return (
      splitRoute.length > 3 &&
      sessionService?.defaultDashboardPeriod &&
      sessionService?.defaultDashboardPeriod.includes(
        splitRoute[3].split('?')[0]
      )
    );
  }

  static containsGlobalPeriodSettings(sessionService) {
    return (
      sessionService?.globalSettingsDto &&
      sessionService?.globalSettingsDto?.numberYearsBack
    );
  }
}
