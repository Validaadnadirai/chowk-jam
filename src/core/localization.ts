export type Language='en'|'hi'|'hinglish';
const messages={
 en:{play:'PLAY',settings:'SETTINGS',tutorial:'HOW TO PLAY',language:'LANGUAGE',coins:'COINS',sound:'SOUND',music:'MUSIC',vibration:'VIBRATION',back:'BACK',start:'START YOUR JOURNEY',subtitle:'Clear the chowk. Keep the city moving.',pause:'PAUSED',resume:'RESUME',restart:'RESTART',home:'HOME',undo:'UNDO',hint:'HINT',extra:'EXTRA SLOT',shuffle:'SHUFFLE'},
 hi:{play:'खेलें',settings:'सेटिंग्स',tutorial:'कैसे खेलें',language:'भाषा',coins:'सिक्के',sound:'आवाज़',music:'म्यूज़िक',vibration:'वाइब्रेशन',back:'वापस',start:'अपना सफ़र शुरू करें',subtitle:'चौक खाली करो, शहर चलने दो।',pause:'रुका हुआ',resume:'जारी रखें',restart:'फिर शुरू करें',home:'होम',undo:'वापस',hint:'इशारा',extra:'एक स्लॉट और',shuffle:'बदलें'},
 hinglish:{play:'CHALO KHELEIN',settings:'SETTINGS',tutorial:'KAISE KHELEIN',language:'LANGUAGE',coins:'COINS',sound:'SOUND',music:'MUSIC',vibration:'VIBRATION',back:'BACK',start:'APNA SAFAR SHURU KARO',subtitle:'Chowk clear karo. City ko chalte rakho.',pause:'PAUSED',resume:'RESUME',restart:'RESTART',home:'HOME',undo:'UNDO',hint:'HINT',extra:'EXTRA SLOT',shuffle:'SHUFFLE'}
} as const;
export type MessageKey=keyof typeof messages.en;
export function t(language:Language,key:MessageKey):string{return messages[language][key]??messages.en[key];}
