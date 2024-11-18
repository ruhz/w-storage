export module singbox {

    export interface IInboundFile {
        inbounds: IInbound[]
    }

    export interface IInbound {
        "type": string,
        "tag": string,
        "listen": string,
        "listen_port": number
    }
}