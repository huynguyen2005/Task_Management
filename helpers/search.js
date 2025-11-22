module.exports = (keyword) => {
    let regex = new RegExp(keyword, 'i');
    return regex;
}
