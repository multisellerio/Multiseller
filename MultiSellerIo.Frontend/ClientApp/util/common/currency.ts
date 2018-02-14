
let currencySymbol = "Rs.";

export const convertToCurrency = (value: string) => {
    var regExp = new RegExp('\\' + currencySymbol +'\\s?|(,*)',"g");
    return `${currencySymbol}${value && typeof value.replace === "function" ? value.replace(regExp, '') : value}`.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ',');
}

export const currentyToNumeric = (value: string) => {
    return Number(value.replace(currencySymbol, "").replace(",", ""));
}

export const numberToCurrency = (value: number) => {
    return `${currencySymbol}${value.toFixed(2)}`;
}