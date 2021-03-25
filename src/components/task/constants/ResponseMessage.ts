export enum ResponseMessage {
   IPNMode = "IPN Mode is not HMAC",
   NoHMAC = "No HMAC signature sent",
   NoMerchant = "No or incorrect Merchant ID passed",
   SignatureNotMatch = "HMAC signature does not match",
}
