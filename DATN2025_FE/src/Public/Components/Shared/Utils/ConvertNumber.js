function ConvertNumber(num) {
    num = parseInt(num);
    let formattedNumber = num.toLocaleString('de-DE');
    formattedNumber = formattedNumber + 'đ';
    return formattedNumber
}

export default ConvertNumber
