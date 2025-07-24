export interface OperationResult<t=any>{
    success: boolean;
    data?: any;
    status?: number;
}