class ApiFeature {
    constructor(mongooseQuery, queryStr) {
        this.mongooseQuery = mongooseQuery;
        this.queryStr = queryStr;
        this.paginationResult = {};
    }

    filtering() {
        const queryObject = { ...this.queryStr };

        // Fields to exclude from filtering
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludedFields.forEach((field) => delete queryObject[field]);

        // Handle MongoDB filtering operators (gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }

    sorting() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    fields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }
        return this;
    }

    searching() {
        if (this.queryStr.keyword) {
            const query = {
                $or: [
                    { name: { $regex: this.queryStr.keyword, $options: 'i' } },
                    { desc: { $regex: this.queryStr.keyword, $options: 'i' } },
                ],
            };
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    pagination(numberOfDocuments) {
        const page = parseInt(this.queryStr.page, 10) || 1;
        const limit = parseInt(this.queryStr.limit, 10) || 8;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        this.paginationResult = {
            page,
            limit,
            numberOfPages: Math.ceil(numberOfDocuments / limit),
        };

        if (endIndex < numberOfDocuments) {
            this.paginationResult.next = page + 1;
        }

        if (skip > 0) {
            this.paginationResult.prev = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
}

export default ApiFeature;