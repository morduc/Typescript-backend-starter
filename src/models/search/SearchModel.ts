export interface SearchModel {
    query: {
        selector: {
            docType: string
        },
        fields?: any,
        sort?: any
    },
    pageSize?: string,
    pageBookmark?: string
}