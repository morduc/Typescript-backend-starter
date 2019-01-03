export class Utils {

    static marshalArgs(args: any) {
        if (!args) {
            return args;
        }

        if (typeof args === 'string') {
            return [args];
        }

        if (Array.isArray(args)) {
            return args.map((arg:any) => typeof arg === 'object' ? JSON.stringify(arg) : arg.toString());
        }

        if (typeof args === 'object') {
            return [ JSON.stringify(args) ];
        }
    }

    static unmarshalResult(result: any) {
        if (!Array.isArray(result)) {
            return result;
        }

        if(result.length === 1 && result[0].details && result[0].details !== ""){
            throw new Error(result[0].details);
        }
        else if(result.length === 1 && result[0] && result[0].toString().match(/Error:/)){
            throw new Error(result[0]);
        }

        let buff = Buffer.concat(result);
        if (!Buffer.isBuffer(buff)) {
            return result;
        }
        let json = buff.toString('utf8');
        if (!json) {
            return null;
        }

        return JSON.parse(json);
    }

    static unmarshalBlock(block: any) {

        if(block && block.data && block.header && block.data.data){

            let transactions = null;

            if(Array.isArray(block.data.data)){
                transactions = block.data.data.map(({ payload: { header, data } }:any) => {
                    const { channel_header } = header;
                    const { type, timestamp, epoch } = channel_header;
                    return { type, timestamp };
                });
            }
            else{
                transactions = [];
            }

            return {
                id: block.header.number.toString(),
                fingerprint: block.header.data_hash.slice(0, 20),
                transactions: transactions
            };
        }

        return {};
    }

}