import { Interface } from "readline"

export module fmodel {
	export interface IFoundInfo {
		name: string
		symbol: string
	}

	export interface IUserFoundForm {
		user: string
		name: string
		symbol: string
		orientation: string
		amount: number
		state: string | undefined
		price: number | undefined
		rate: string
		trade1: string
		trade2: string
		trade3: string
		trade4: string
		trade5: string
	}

	export interface IUserTrade {
		user: string
		symbol: string
		date: string
		amount: number
	}

	export interface IFundHistory {
		date: string
		price: number
	}

	export let funds: IFoundInfo[] = [
		{ name: "原油指数", symbol: "160416" },
		{ name: "5G", symbol: "008087" },
		{ name: "计算机", symbol: "001630" },
		{ name: "证券", symbol: "004070" },
		{ name: "标普500", symbol: "006075" },
		{ name: "纳指", symbol: "270042" },
		{ name: "海外中", symbol: "006328" },
		{ name: "广发油服", symbol: "004243" },
		{ name: "印度", symbol: "164824" },
		{ name: "中25", symbol: "006355" },
		{ name: "小型股", symbol: "006263" },
		{ name: "创", symbol: "001593" },
		{ name: "半导体", symbol: "007301" },
		{ name: "电子", symbol: "001618" },
		{ name: "精医", symbol: "501006" },
		{ name: "生科", symbol: "501010" },
		{ name: "百发", symbol: "000827" },
		{ name: "上证50", symbol: "004746" },
		{ name: "沪深300", symbol: "006021" },
		{ name: "军工", symbol: "005693" },
		{ name: "创科", symbol: "007356" },
		{ name: "智能", symbol: "005963" },
		{ name: "食品", symbol: "001632" },
		{ name: "银行", symbol: "001595" },
		{ name: "地产", symbol: "004643" },
		{ name: "证券", symbol: "004070" },
		{ name: "建材", symbol: "004857" },
		{ name: "工程", symbol: "005224" },
		{ name: "家电", symbol: "005064" },
		{ name: "可选", symbol: "002977" },
		{ name: "汽车", symbol: "004855" },
		{ name: "环保", symbol: "002984" },
		{ name: "体育", symbol: "013278" },
		{ name: "中小300", symbol: "270026" },
		{ name: "黄金", symbol: "002611" },
		{ name: "新能源", symbol: "005940" },
		{ name: "农业", symbol: "010770" },
		{ name: "光伏", symbol: "011103" },
		{ name: "有色", symbol: "010990" },
		{ name: "煤炭", symbol: "013275" },
		{ name: "稀土", symbol: "011036" },
		{ name: "钢铁", symbol: "008190" },
		{ name: "金珠", symbol: "002207" },
		{ name: "创科5", symbol: "011609" },
		{ name: "芯片", symbol: "012553" },
		{ name: "恒科", symbol: "012349" },
		{ name: "越南", symbol: "008764" },
		{ name: "创未", symbol: "501207" },
		{ name: "北证50", symbol: "017513" },
		{ name: "格林酒", symbol: "004943" },
		{ name: "永美", symbol: "007041" },
		{ name: "富国债", symbol: "019518" },
		{ name: "易国债", symbol: "009803" },
		// { name: "", symbol: "" },
	]

	export interface IFundResult {
		fbrq: string
		jjjz: string
		ljjz: string
	}

	export interface IFundNav {
		date: Date
		jjjz: number
		ljjz: number
	}
}
