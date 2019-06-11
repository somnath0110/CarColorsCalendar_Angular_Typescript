function getCurrentDateMMDDYYYY() {
    let dt: Date = new Date();
    let year: number = dt.getFullYear();
    let month: number = dt.getMonth() + 1;
    let day: number = dt.getDate();

    let dateStr: string = '' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + '-' + year;
    return dateStr;
}

export default getCurrentDateMMDDYYYY;