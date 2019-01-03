export interface InvokeRequest {
  chaincodeId: string,
  fcn: string,
  args: string[],
  transientMap?: any
}

export interface QueryRequest extends InvokeRequest{}