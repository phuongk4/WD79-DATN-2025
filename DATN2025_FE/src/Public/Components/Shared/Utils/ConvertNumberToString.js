function ConvertNumberToString(num) {
    num = parseInt(num);
    if (num >= 1000000) {
        return (num / 1000000) + ' triệu';
    } else if (num >= 100000) {
        const hundreds = Math.floor(num / 100000);
        const thousands = Math.floor((num % 100000) / 1000);
        return `${hundreds} trăm ${thousands} nghìn`;
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + ' nghìn';
    } else {
        return num.toLocaleString('vi-VN');
    }
}

export default ConvertNumberToString
