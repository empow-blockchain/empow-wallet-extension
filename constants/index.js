export const APP_STATE = {
    UNINITIALISED: 0,
    PASSWORD_SET: 1,
    UNLOCKED: 2,
    CREATING: 3,
    RESTORING: 4,
    READY: 5,
    SEARCH: 6,
    SETTING: 7,
    SIGN_TRANSACTION: 10,
}

export const API_ENDPOINT = "https://api.empow.io"

export const CURRENCY_SYMBOL = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
}

export const TX_API = "https://emscan.io/tx/"

export const NODE = {
    MAINNET: {
        URL: "https://node.empow.io",
        API_URL: "https://api.empow.io"
    },
    TESTNET: {
        URL: "https://node-testnet.empow.io",
        API_URL: "https://api-testnet.empow.io"
    }
}