module.exports = (totalRecord, page) => {
    const initPagination = {
        currentPage: 1,
        limitRecord: 2
    };
    if (page) {
        initPagination.currentPage = parseInt(page);
    }

    initPagination.skip = (initPagination.currentPage - 1) * initPagination.limitRecord;
    initPagination.totalPage = Math.ceil(totalRecord / initPagination.limitRecord);
    return initPagination;
}