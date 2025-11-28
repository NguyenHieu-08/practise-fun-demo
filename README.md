# Product Management App

**Micro-app quản lý sản phẩm**

# Install json-server

{
"verificationPurposes": [
{
"key": "poi",
"label": "Proof of Identity (POI)",
"documents": [
{
"label": "Passport",
"isSelected": true,
"isDisabled": true
},
{
"label": "ID Card",
"isSelected": true,
"isDisabled": true
},
{
"label": "Driving Licence",
"isSelected": true,
"isDisabled": true
}
]
},
{
"key": "poa",
"label": "Proof of Address (POA)",
"documents": [
{
"label": "Utility Bill",
"isSelected": false,
"isDisabled": false
},
{
"label": "Rental Agreement",
"isSelected": true,
"isDisabled": true
},
{
"label": "Bank Statement",
"isSelected": false,
"isDisabled": false
}
]
},
{
"key": "selfie",
"label": "Selfie",
"documents": []
}
],
"blockingRules": [
{
"id": 1,
"casinoBonus": false,
"sbBonus": false,
"blockCasino": true,
"blockSB": false,
"blockWithdrawals": false,
"betBuilder": false,
"blockBetBuilder": false
},
{
"id": 2,
"casinoBonus": false,
"sbBonus": false,
"blockCasino": true,
"blockSB": true,
"blockWithdrawals": true,
"betBuilder": false,
"blockBetBuilder": false
}
],
"notification": [
{
"id": 1,
"label": "Email Notification",
"isSelected": false
},
{
"id": 2,
"label": "Personal Message",
"isSelected": false
},
{
"id": 3,
"label": "On-screen Announcement",
"isSelected": false
},
{
"id": 4,
"label": "Phone",
"isSelected": true
}
]
}