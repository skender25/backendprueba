export interface IContext{
    req: IRequest;
    connection: IConection;
}

interface IRequest{
    headers: {
        authorization: string;

    };
}

interface IConection{
    authorization: string;
}