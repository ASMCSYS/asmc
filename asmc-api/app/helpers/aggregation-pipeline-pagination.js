export const paginationPipeLine = (
    pageNo = 0,
    filter = {},
    limit = 1000,
    sort = {},
    select = null,
    extra = null
) => {
    const skip = Number(pageNo) * limit;

    let pipeline = [];

    if (extra && extra.length > 0) {
        extra.forEach((obj) => {
            pipeline.push(obj);
        });
    }

    // Apply $match stage for initial filtering
    pipeline.push({
        $match: filter,
    });

    // If sort is specified, apply it
    if (sort) {
        pipeline.push({
            $sort: sort,
        });
    }

    // Apply $facet to handle pagination and project the necessary fields
    pipeline.push(
        {
            $facet: {
                total: [
                    {
                        $count: "count",
                    },
                ],
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    ...(select ? [{ $project: select }] : []),
                ],
            },
        },
        {
            $unwind: "$total",
        },
        {
            $project: {
                result: "$data",
                count: "$total.count",
            },
        }
    );

    return pipeline;
};
