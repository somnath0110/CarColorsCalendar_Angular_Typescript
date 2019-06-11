import IProductionDay from './iproduction-day.model';

class ProductionDay implements IProductionDay {
    day: string;
    date: string;
    color: string;
    isProdDay: boolean;
    isWeekOff: boolean;
    isHoliday: boolean;
    isPastday: boolean;

    constructor() {
        this.day = '';
        this.date = '';
        this.color = '';
        this.isProdDay = true;
        this.isWeekOff = false;
        this.isHoliday = false;
        this.isPastday = false;
    }
}

export default ProductionDay;