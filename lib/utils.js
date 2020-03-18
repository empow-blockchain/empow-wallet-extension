import crypto from 'crypto'

const Utils = {

    encryptionAlgorithm: 'aes-256-ctr',
    
    encrypt(data, key) {
        const encoded = JSON.stringify(data);
        const cipher = crypto.createCipher(this.encryptionAlgorithm, key);

        let crypted = cipher.update(encoded, 'utf8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
    },

    decrypt(data, key) {
        const decipher = crypto.createDecipher(this.encryptionAlgorithm, key);

        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    },

    formatTime (timestamp) {
        const date = new Date(timestamp * 1000)

        return `${this.addZero(date.getHours())}:${this.addZero(date.getMinutes())} ${this.addZero(date.getDate())}-${this.addZero(date.getMonth()+1)}-${date.getFullYear()}`
    },

    addZero (number) {
        if(number < 10) return "0" + number
        return number
    },

    randomString (length) {
        var result           = '';
        var characters       = 'abcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    randomIntNumber(min, max) {
        return parseInt(Math.random() * (max - min) + min)
    },

    generateEosAccount () {
        return this.randomString(12)
    },

    generateIostAccount () {
        return this.randomString(this.randomIntNumber(5,11))
    },

    formatCurrency (amount, decimalCount = 8, decimal = ".", thousands = ",") {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 8 : decimalCount;
    
        const negativeSign = amount < 0 ? "-" : "";
    
        let i = parseFloat(parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()).toString()
        let j = (i.length > 3) ? i.length % 3 : 0;

        let decimalPart = decimalCount ? Math.abs(amount - i).toFixed(decimalCount).slice(2) : ""
        decimalPart = '0.' + decimalPart

        if(parseFloat(decimalPart) == 0) {
            decimalPart = ''
        } else {
            decimalPart = parseFloat(decimalPart).toString().substring(1,decimalPart.length)
        }

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + decimalPart;
    }
}

export default Utils