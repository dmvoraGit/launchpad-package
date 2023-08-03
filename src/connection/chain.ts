export enum SupportedChainId {
	MAINNET = 1,
	ROPSTEN = 3,
	RINKEBY = 4,
	GOERLI = 5,
	KOVAN = 42,

	BSC = 56,
	BSC_TESTNET = 97,

	ARBITRUM_ONE = 42161,
	ARBITRUM_RINKEBY = 421611,

	OPTIMISM = 10,
	OPTIMISTIC_KOVAN = 69,

	POLYGON = 137,
	POLYGON_MUMBAI = 80001,
}

export const CHAIN_IDS_TO_NAMES = {
	[SupportedChainId.MAINNET]: "mainnet",
	[SupportedChainId.ROPSTEN]: "ropsten",
	[SupportedChainId.RINKEBY]: "rinkeby",
	[SupportedChainId.GOERLI]: "goerli",
	[SupportedChainId.KOVAN]: "kovan",
	[SupportedChainId.BSC]: "bsc",
	[SupportedChainId.BSC_TESTNET]: "bsc_testnet",
	[SupportedChainId.ARBITRUM_ONE]: "arbitrum_one",
	[SupportedChainId.ARBITRUM_RINKEBY]: "arbitrum_rinkeby",
	[SupportedChainId.OPTIMISM]: "optimism",
	[SupportedChainId.OPTIMISTIC_KOVAN]: "optimistic_kovan",
	[SupportedChainId.POLYGON]: "polygon",
	[SupportedChainId.POLYGON_MUMBAI]: "polygon_mumbai",
};

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(
	SupportedChainId
).filter((id) => typeof id === "number") as SupportedChainId[];

export const NATIVE_TOKEN: { [index: number]: string } = {
	1: "ETH",
	4: "ETH",
	5: "ETH",
	97: "BNB",
	56: "BNB",
	137: "MATIC",
	80001: "MATIC",
	1666600000: "ONE",
	1666700000: "ONE",
};

export const NETWORK_DETAILS = {
	MAINNET: {
		chainId: `0x${SupportedChainId.MAINNET.toString(16)}`,
		chainName: CHAIN_IDS_TO_NAMES[SupportedChainId.MAINNET],
		chainRaw: SupportedChainId.MAINNET,
	},
	RINKEBY: {
		chainId: `0x${SupportedChainId.RINKEBY.toString(16)}`,
		chainName: CHAIN_IDS_TO_NAMES[SupportedChainId.RINKEBY],
		chainRaw: SupportedChainId.RINKEBY,
	},
	GOERLI: {
		chainId: `0x${SupportedChainId.GOERLI.toString(16)}`,
		chainName: CHAIN_IDS_TO_NAMES[SupportedChainId.GOERLI],
		// chainRaw: SupportedChainId.GOERLI,
	},
};

export enum NetworkType {
	L1,
	L2,
}

const CHAIN_INFO: any = {
	[SupportedChainId.MAINNET]: {
		networkType: NetworkType.L1,
		// docs: 'https://docs.uniswap.org/',
		explorer: "https://etherscan.io/",
		// infoLink: 'https://info.uniswap.org/#/',
		label: "Ethereum",
		// logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
		// color: darkTheme.chain_1,
	},
	[SupportedChainId.GOERLI]: {
		networkType: NetworkType.L1,
		// docs: 'https://docs.uniswap.org/',
		explorer: "https://goerli.etherscan.io/",
		// infoLink: 'https://info.uniswap.org/#/',
		label: "Görli",
		// logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Görli Ether", symbol: "görETH", decimals: 18 },
		// color: darkTheme.chain_5,
	},
	[SupportedChainId.BSC_TESTNET]: {
		networkType: NetworkType.L1,
		// blockWaitMsBeforeWarning: ms`10m`,
		// bridge: 'https://wallet.polygon.technology/bridge',
		// docs: 'https://polygon.io/',
		explorer: "`https://testnet.bscscan.com`",
		// infoLink: 'https://info.uniswap.org/#/polygon/',
		label: "BSC Testnet",
		// logoUrl: polygonMaticLogo,
		nativeCurrency: { name: "BNB", symbol: "bnb", decimals: 18 },
	},
	[SupportedChainId.BSC]: {
		networkType: NetworkType.L1,
		// blockWaitMsBeforeWarning: ms`10m`,
		// bridge: 'https://wallet.polygon.technology/bridge',
		// docs: 'https://polygon.io/',
		explorer: "`https://bscscan.com`",
		// infoLink: 'https://info.uniswap.org/#/polygon/',
		label: "Binance Smart Chain",
		// logoUrl: polygonMaticLogo,
		nativeCurrency: { name: "BNB", symbol: "bnb", decimals: 18 },
	},
};

export function getChainInfo(chainId: any): any {
	if (chainId) {
		return CHAIN_INFO[chainId] ?? undefined;
	}
	return undefined;
}

export function isSupportedChain(
	chainId: number | null | undefined
): chainId is SupportedChainId {
	return !!chainId && !!SupportedChainId[chainId];
}

export const FALLBACK_DEFAULT_CHAIN: number = SupportedChainId.MAINNET; // Todo change this for release
export const DAPP_SUPPORTED_ON_CHAINS: number[] = [
	SupportedChainId.MAINNET,
	SupportedChainId.BSC,
];
