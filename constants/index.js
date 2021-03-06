export const APP_STATE = {
    UNINITIALISED: 0,
    PASSWORD_SET: 1,
    UNLOCKED: 2,
    CREATING: 3,
    RESTORING: 4,
    READY: 5,
    SEARCH: 6,
    SETTING: 7,
    COIN_DETAIL: 8,
    SIGN_TRANSACTION: 10,
}

export const CURRENCY_SYMBOL = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
}

export const NODE = {
    MAINNET: {
        URL: "https://node.empow.io",
        API_URL: "https://api.emscan.io",
        TX_URL: 'https://emscan.io/tx',
    },
    TESTNET: {
        URL: "https://node-testnet.empow.io",
        API_URL: "https://api-testnet.emscan.io/",
        TX_URL: 'https://testnet.emscan.io/tx'
    }
}