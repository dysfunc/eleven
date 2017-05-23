
  export default {
    allTypes: [
      {name: 'Google UK English Male'}, //0 male uk android/chrome
      {name: 'Agnes'}, //1 female us safari mac
      {name: 'Daniel Compact'}, //2 male us safari mac
      {name: 'Google UK English Female'}, //3 female uk android/chrome
      {name: 'en-GB', rate: 0.25, pitch: 1}, //4 male uk IOS
      {name: 'en-AU', rate: 0.25, pitch: 1}, //5 female english IOS
      {name: 'inglés Reino Unido'}, //6 spanish english android
      {name: 'English United Kingdom'}, //7 english english android
      {name: 'Fallback en-GB Female', lang: 'en-GB', fallbackvoice: true}, //8 fallback english female
      {name: 'Eszter Compact'}, //9 Hungarian mac
      {name: 'hu-HU', rate: 0.4}, //10 Hungarian iOS
      {name: 'Fallback Hungarian', lang: 'hu', fallbackvoice: true}, //11 Hungarian fallback
      {name: 'Fallback Serbian', lang: 'sr', fallbackvoice: true}, //12 Serbian fallback
      {name: 'Fallback Croatian', lang: 'hr', fallbackvoice: true}, //13 Croatian fallback
      {name: 'Fallback Bosnian', lang: 'bs', fallbackvoice: true}, //14 Bosnian fallback
      {name: 'Fallback Spanish', lang: 'es', fallbackvoice: true}, //15 Spanish fallback
      {name: 'Spanish Spain'}, //16 female es android/chrome
      {name: 'español España'}, //17 female es android/chrome
      {name: 'Diego Compact', rate: 0.3}, //18 male es mac
      {name: 'Google Español'}, //19 male es chrome
      {name: 'es-ES', rate: 0.20}, //20 male es iOS
      {name: 'Google Français'}, //21 FR chrome
      {name: 'French France'}, //22 android/chrome
      {name: 'francés Francia'}, //23 android/chrome
      {name: 'Virginie Compact', rate: 0.5}, //24 mac
      {name: 'fr-FR', rate: 0.25}, //25 iOS
      {name: 'Fallback French', lang: 'fr', fallbackvoice: true}, //26 fallback
      {name: 'Google Deutsch'}, //27 DE chrome
      {name: 'German Germany'}, //28 android/chrome
      {name: 'alemán Alemania'}, //29 android/chrome
      {name: 'Yannick Compact', rate: 0.5}, //30 mac
      {name: 'de-DE', rate: 0.25}, //31 iOS
      {name: 'Fallback Deutsch', lang: 'de', fallbackvoice: true}, //32 fallback
      {name: 'Google Italiano'}, //33 IT chrome
      {name: 'Italian Italy'}, //34 android/chrome
      {name: 'italiano Italia'}, //35 android/chrome
      {name: 'Paolo Compact', rate: 0.5}, //36 mac
      {name: 'it-IT', rate: 0.25}, //37 iOS
      {name: 'Fallback Italian', lang: 'it', fallbackvoice: true}, //38 fallback
      {name: 'Google US English', timerSpeed:1}, //39 EN chrome
      {name: 'English United States'}, //40 android/chrome
      {name: 'inglés Estados Unidos'}, //41 android/chrome
      {name: 'Vicki'}, //42 mac
      {name: 'en-US', rate: 0.2, pitch: 1, timerSpeed:1.3}, //43 iOS
      {name: 'Fallback English', lang: 'en-US', fallbackvoice: true, timerSpeed:0}, //44 fallback
      {name: 'Fallback Dutch', lang: 'nl', fallbackvoice: true, timerSpeed:0}, //45 fallback
      {name: 'Fallback Romanian', lang: 'ro', fallbackvoice: true}, //46 Romanian Male fallback
      {name: 'Milena Compact'}, //47 Russian mac
      {name: 'ru-RU', rate: 0.25}, //48 iOS
      {name: 'Fallback Russian', lang: 'ru', fallbackvoice: true}, //49 Russian fallback
      {name: 'Google 日本人', timerSpeed:1}, //50 JP Chrome
      {name: 'Kyoko Compact'}, //51 Japanese mac
      {name: 'ja-JP', rate: 0.25}, //52 iOS
      {name: 'Fallback Japanese', lang: 'ja', fallbackvoice: true}, //53 Japanese fallback
      {name: 'Google 한국의', timerSpeed:1}, //54 KO Chrome
      {name: 'Narae Compact'}, //55 Korean mac
      {name: 'ko-KR', rate: 0.25}, //56 iOS
      {name: 'Fallback Korean', lang: 'ko', fallbackvoice: true}, //57 Korean fallback
      {name: 'Google 中国的', timerSpeed:1}, //58 CN Chrome
      {name: 'Ting-Ting Compact'}, //59 Chinese mac
      {name: 'zh-CN', rate: 0.25}, //60 iOS
      {name: 'Fallback Chinese', lang: 'zh-CN', fallbackvoice: true}, //61 Chinese fallback

      {name: 'Alexandros Compact'}, //62 Greek Male Mac
      {name: 'el-GR', rate: 0.25}, //63 iOS
      {name: 'Fallback Greek', lang: 'el', fallbackvoice: true}, //64 Greek Female fallback

      {name: 'Fallback Swedish', lang: 'sv', fallbackvoice: true}, //65 Swedish Female fallback

      {name: 'hi-IN', rate: 0.25}, //66 iOS
      {name: 'Fallback Hindi', lang: 'hi', fallbackvoice: true}, //67 Hindi Female fallback

      {name: 'Fallback Catalan', lang: 'ca', fallbackvoice: true}, //68 Catalan Male fallback

      {name: 'Aylin Compact'}, //69 Turkish Female Mac
      {name: 'tr-TR', rate: 0.25}, //70 iOS Turkish Female
      {name: 'Fallback Turkish', lang: 'tr', fallbackvoice: true}, //71 Turkish Female fallback

      {name: 'Stine Compact'}, //72 Norweigan Male Mac

      {name: 'no-NO', rate: 0.25}, //73 iOS Female
      {name: 'Fallback Norwegian', lang: 'no', fallbackvoice: true}, //74 Norwegian Female fallback

      {name: 'Daniel'}, //75 English UK male uk safari 8 mac
      {name: 'Monica'}, //76 Spanish female es safari 8 mac
      {name: 'Amelie'}, //77 French Canadian female fr safari 8 mac
      {name: 'Anna'}, //78 female de safari 8 mac
      {name: 'Alice'}, //79 Italian female it safari 8 mac
      {name: 'Melina'}, //80 Greek female gr safari 8 mac
      {name: 'Mariska'}, //81 Hungarian female hu safari 8 mac
      {name: 'Yelda'}, //82 Turkish female tr safari 8 mac
      {name: 'Milena'}, //83 Russian female ru safari 8 mac

      // Gender Disparity
      {name: 'Xander'}, //84 Dutch female nl safari 8 mac
      {name: 'Alva'},  //85 Swedish female sv safari 8 mac

      // Gender Disparity
      {name: 'Lee Compact'}, //86 Australian Male Mac
      {name: 'Karen'}, //87 Australian Female safari 8 mac
      {name: 'Fallback Australian', lang: 'en-AU', fallbackvoice: true}, //88 Australian Female fallback

      // Gender Disparity
      {name: 'Mikko Compact'}, //89 Finnish Male Mac
      {name: 'Satu'}, //90 Finnish Female safari 8 mac
      {name: 'fi-FI', rate: 0.25}, //91 iOS
      {name: 'Fallback Finnish', lang: 'fi', fallbackvoice: true}, //92 Finnish Female fallback

      {name: 'Fallback Afrikans', lang: 'af', fallbackvoice: true}, //93 Afrikans Male fallback

      {name: 'Fallback Albanian', lang: 'sq', fallbackvoice: true}, //94 Albanian Male fallback

      {name: 'Maged Compact'}, //95 Arabic Male Mac
      {name: 'Tarik'}, //96 Arabic Male safari 8 mac
      {name: 'ar-SA', rate: 0.25}, //97 iOS
      {name: 'Fallback Arabic', lang: 'ar', fallbackvoice: true}, //98 Arabic Male fallback

      {name: 'Fallback Armenian', lang: 'hy', fallbackvoice: true}, //99 Armenian Male fallback
      {name: 'Zuzana Compact'}, //100 Czech Female Mac
      {name: 'Zuzana'}, //101 Czech Female safari 8 mac
      {name: 'cs-CZ', rate: 0.25}, //102 iOS
      {name: 'Fallback Czech', lang: 'cs', fallbackvoice: true}, //103 Czech Female fallback
      {name: 'Ida Compact'}, //104 Danish Female Mac
      {name: 'Sara'}, //105 Danish Female safari 8 mac
      {name: 'da-DK', rate: 0.25}, //106 iOS
      {name: 'Fallback Danish', lang: 'da', fallbackvoice: true}, //107 Danish Female fallback
      {name: 'Fallback Esperanto', lang: 'eo', fallbackvoice: true}, //108 Esperanto Male fallback
      {name: 'Fallback Hatian Creole', lang: 'ht', fallbackvoice: true}, //109 Hatian Creole Female fallback
      {name: 'Fallback Icelandic', lang: 'is', fallbackvoice: true}, //110 Icelandic Male fallback
      {name: 'Damayanti'}, //111 Indonesian Female safari 8 mac
      {name: 'id-ID', rate: 0.25}, //112 iOS
      {name: 'Fallback Indonesian', lang: 'id', fallbackvoice: true}, //113 Indonesian Female fallback
      {name: 'Fallback Latin', lang: 'la', fallbackvoice: true}, //114 Latin Female fallback
      {name: 'Fallback Latvian', lang: 'lv', fallbackvoice: true}, //115 Latvian Male fallback
      {name: 'Fallback Macedonian', lang: 'mk', fallbackvoice: true}, //116 Macedonian Male fallback
      {name: 'Fallback Moldavian', lang: 'mo', fallbackvoice: true}, //117 Moldavian Male fallback
      {name: 'Fallback Montenegrin', lang: 'sr-ME', fallbackvoice: true}, //118 Montenegrin Male fallback
      {name: 'Agata Compact'}, //119 Polish Female Mac
      {name: 'Zosia'}, //120 Polish Female safari 8 mac
      {name: 'pl-PL', rate: 0.25}, //121 iOS
      {name: 'Fallback Polish', lang: 'pl', fallbackvoice: true}, //122 Polish Female fallback
      {name: 'Raquel Compact'}, //123 Brazilian Portugese Female Male Mac
      {name: 'Luciana'}, //124 Brazilian Portugese Female safari 8 mac
      {name: 'pt-BR', rate: 0.25}, //125 iOS
      {name: 'Fallback Brazilian Portugese', lang: 'pt-BR', fallbackvoice: true}, //126 Brazilian Portugese Female fallback
      {name: 'Joana Compact'}, //127 Portuguese Female Mac
      {name: 'Joana'}, //128 Portuguese Female safari 8 mac
      {name: 'pt-PT', rate: 0.25}, //129 iOS
      {name: 'Fallback Portuguese', lang: 'pt-PT', fallbackvoice: true}, //130 Portuguese Female fallback
      {name: 'Fallback Serbo-Croation', lang: 'sh', fallbackvoice: true}, //131 Serbo-Croation Male fallback
      {name: 'Laura Compact'}, //132 Slovak Female Mac
      {name: 'Laura'}, //133 Slovak Female safari 8 mac
      {name: 'sk-SK', rate: 0.25}, //134 iOS
      {name: 'Fallback Slovak', lang: 'sk', fallbackvoice: true}, //135 Slovak Female fallback

      // Gender Disparity
      {name: 'Javier Compact'}, //136 Spanish (Latin American) Male Mac
      {name: 'Paulina'}, //137 Spanish Mexican Female safari 8 mac
      {name: 'es-MX', rate: 0.25}, //138 iOS
      {name: 'Fallback Spanish (Latin American)', lang: 'es-419', fallbackvoice: true}, //139 Spanish (Latin American) Female fallback
      {name: 'Fallback Swahili', lang: 'sw', fallbackvoice: true}, //140 Swahili Male fallback
      {name: 'Fallback Tamil', lang: 'ta', fallbackvoice: true}, //141 Tamil Male fallback
      {name: 'Narisa Compact'}, //142 Thai Female Mac
      {name: 'Kanya'}, //143 Thai Female safari 8 mac
      {name: 'th-TH', rate: 0.25}, //144 iOS
      {name: 'Fallback Thai', lang: 'th', fallbackvoice: true}, //145 Thai Female fallback
      {name: 'Fallback Vietnamese', lang: 'vi', fallbackvoice: true}, //146 Vietnamese Male fallback
      {name: 'Fallback Welsh', lang: 'cy', fallbackvoice: true}, //147 Welsh Male fallback

      // Gender Disparity
      {name: 'Oskar Compact'}, //148 Swedish Male Mac
      {name: 'sv-SE', rate: 0.25}, //149 iOS

      // Gender Disparity
      {name: 'Simona Compact'}, //150 Romanian mac female
      {name: 'Ioana'}, //151 Romanian Female safari 8 mac
      {name: 'ro-RO', rate: 0.25}, //152 iOS female
      {name: 'Kyoko'}, //153 Japanese Female safari 8 mac
      {name: 'Lekha'}, //154 Hindi Female safari 8 mac
      {name: 'Ting-Ting'}, //155 Chinese Female safari 8 mac
      {name: 'Yuna'}, //156 Korean Female safari 8 mac

      // Gender Disparity
      {name: 'Xander Compact'}, //157 Dutch male or female nl safari 8 mac
      {name: 'nl-NL', rate: 0.25}, //158 iOS
      {name: 'Fallback UK English Male', lang: 'en-GB', fallbackvoice: true, service: 'g1', voicename: 'rjs'}, //159 UK Male fallback
      {name: 'Finnish Male', lang: 'fi', fallbackvoice: true, service: 'g1', voicename: ''}, //160 Finnish Male fallback
      {name: 'Czech Male', lang: 'cs', fallbackvoice: true, service: 'g1', voicename: ''}, //161 Czech Male fallback
      {name: 'Danish Male', lang: 'da', fallbackvoice: true, service: 'g1', voicename: ''}, //162 Danish Male fallback
      {name: 'Greek Male', lang: 'el', fallbackvoice: true, service: 'g1', voicename: ''}, //163 Greek Male fallback
      {name: 'Hungarian Male', lang: 'hu', fallbackvoice: true, service: 'g1', voicename: ''}, //164 Hungarian Male fallback
      {name: 'Latin Male', lang: 'la', fallbackvoice: true, service: 'g1', voicename: ''}, //165 Latin Male fallback
      {name: 'Norwegian Male', lang: 'no', fallbackvoice: true, service: 'g1', voicename: ''}, //166 Norwegian Male fallback
      {name: 'Slovak Male', lang: 'sk', fallbackvoice: true, service: 'g1', voicename: ''}, //167 Slovak Male fallback
      {name: 'Swedish Male', lang: 'sv', fallbackvoice: true, service: 'g1', voicename: ''}, //168 Swedish Male fallback
      {name: 'Fallback US English Male', lang: 'en', fallbackvoice: true, service: 'tts-api', voicename: ''}, //169 US English Male fallback
      {name: 'German Germany', lang: 'de_DE'}, //170 Android 5 German Female
      {name: 'English United Kingdom', lang: 'en_GB'}, //171 Android 5 English United Kingdom Female
      {name: 'English India', lang: 'en_IN'}, //172 Android 5 English India Female
      {name: 'English United States', lang: 'en_US'}, //173 Android 5 English United States Female
      {name: 'Spanish Spain', lang: 'es_ES'}, //174 Android 5 Spanish Female
      {name: 'Spanish Mexico', lang: 'es_MX'}, //175 Android 5 Spanish Mexico Female
      {name: 'Spanish United States', lang: 'es_US'}, //176 Android 5 Spanish Mexico Female
      {name: 'French Belgium', lang: 'fr_BE'}, //177 Android 5 French Belgium Female
      {name: 'French France', lang: 'fr_FR'}, //178 Android 5 French France Female
      {name: 'Hindi India', lang: 'hi_IN'}, //179 Android 5 Hindi India Female
      {name: 'Indonesian Indonesia', lang: 'in_ID'}, //180 Android 5 Indonesian Female
      {name: 'Italian Italy', lang: 'it_IT'}, //181 Android 5 Italian Female
      {name: 'Japanese Japan', lang: 'ja_JP'}, //182 Android 5 Japanese Female
      {name: 'Korean South Korea', lang: 'ko_KR'}, //183 Android 5 Japanese Female
      {name: 'Dutch Netherlands', lang: 'nl_NL'}, //184 Android 5 Dutch Female
      {name: 'Polish Poland', lang: 'pl_PL'}, //185 Android 5 Polish Female
      {name: 'Portuguese Brazil', lang: 'pt_BR'}, //186 Android 5 Portuguese Brazil Female
      {name: 'Portuguese Portugal', lang: 'pt_PT'}, //187 Android 5 Portuguese Portugal Female
      {name: 'Russian Russia', lang: 'ru_RU'}, //188 Android 5 Russian Female
      {name: 'Thai Thailand', lang: 'th_TH'}, //189 Android 5 Thai Female
      {name: 'Turkish Turkey', lang: 'tr_TR'}, //190 Android 5 Turkish Female
      {name: 'Chinese China', lang: 'zh_CN_#Hans'}, //191 Android 5 Chinese China Female
      {name: 'Chinese Hong Kong', lang: 'zh_HK_#Hans'}, //192 Android 5 Chinese Hong Kong Simplified Female
      {name: 'Chinese Hong Kong', lang: 'zh_HK_#Hant'}, //193 Android 5 Chinese Hong Kong Traditional Female
      {name: 'Chinese Taiwan', lang: 'zh_TW_#Hant'} //194 Android 5 Polish Female
    ],
    defaultTypes: [
      {name: 'UK English Female', ids: [3, 5, 1, 6, 7, 171, 8]},
      {name: 'UK English Male', ids: [0, 4, 2, 6, 7, 75, 159]},
      {name: 'US English Female', ids: [39, 40, 41, 42, 43, 173, 44]},
      {name: 'Arabic Male', ids: [96,95,97,98]},
      {name: 'Armenian Male', ids: [99]},
      {name: 'Australian Female', ids: [87,86,5,88]},
      {name: 'Brazilian Portuguese Female', ids: [124,123,125,186,126]},
      {name: 'Chinese Female', ids: [58, 59, 60, 155, 191, 61]},
      {name: 'Czech Female', ids: [101,100,102,103]},
      {name: 'Danish Female', ids: [105,104,106,107]},
      {name: 'Deutsch Female', ids: [27, 28, 29, 30, 31, 78, 170, 32]},
      {name: 'Dutch Female', ids: [84, 157, 158, 184, 45]},
      {name: 'Finnish Female', ids: [90,89,91,92]},
      {name: 'French Female', ids: [21, 22, 23, 77, 178, 26]},
      {name: 'Greek Female', ids: [62, 63, 80, 64]},
      {name: 'Hatian Creole Female', ids: [109]},
      {name: 'Hindi Female', ids: [66, 154, 179, 67]},
      {name: 'Hungarian Female', ids: [9, 10, 81, 11]},
      {name: 'Indonesian Female', ids: [111,112,180,113]},
      {name: 'Italian Female', ids: [33, 34, 35, 36, 37, 79, 181, 38]},
      {name: 'Japanese Female', ids: [50, 51, 52, 153, 182, 53]},
      {name: 'Korean Female', ids: [54, 55, 56, 156, 183, 57]},
      {name: 'Latin Female', ids: [114]},
      {name: 'Norwegian Female', ids: [72, 73, 74]},
      {name: 'Polish Female', ids: [120,119,121,185,122]},
      {name: 'Portuguese Female', ids: [128,127,129,187,130]},
      {name: 'Romanian Male', ids: [151, 150, 152, 46]},
      {name: 'Russian Female', ids: [47,48,83,188,49]},
      {name: 'Slovak Female', ids: [133,132,134,135]},
      {name: 'Spanish Female', ids: [19, 16, 17, 18, 20, 76, 174, 15]},
      {name: 'Spanish Latin American Female', ids: [137,136,138,175,139]},
      {name: 'Swedish Female', ids: [85, 148, 149, 65]},
      {name: 'Tamil Male', ids: [141]},
      {name: 'Thai Female', ids: [143,142,144,189,145]},
      {name: 'Turkish Female', ids: [69, 70, 82, 190, 71]},
      {name: 'Afrikaans Male', ids: [93]},
      {name: 'Albanian Male', ids: [94]},
      {name: 'Bosnian Male', ids: [14]},
      {name: 'Catalan Male', ids: [68]},
      {name: 'Croatian Male', ids: [13]},
      {name: 'Czech Male', ids: [161]},
      {name: 'Danish Male', ids: [162]},
      {name: 'Esperanto Male', ids: [108]},
      {name: 'Finnish Male', ids: [160]},
      {name: 'Greek Male', ids: [163]},
      {name: 'Hungarian Male', ids: [164]},
      {name: 'Icelandic Male', ids: [110]},
      {name: 'Latin Male', ids: [165]},
      {name: 'Latvian Male', ids: [115]},
      {name: 'Macedonian Male', ids: [116]},
      {name: 'Moldavian Male', ids: [117]},
      {name: 'Montenegrin Male', ids: [118]},
      {name: 'Norwegian Male', ids: [166]},
      {name: 'Serbian Male', ids: [12]},
      {name: 'Serbo-Croatian Male', ids: [131]},
      {name: 'Slovak Male', ids: [167]},
      {name: 'Swahili Male', ids: [140]},
      {name: 'Swedish Male', ids: [168]},
      {name: 'Vietnamese Male', ids: [146]},
      {name: 'Welsh Male', ids: [147]},
      {name: 'US English Male', ids: [169]}
    ]
  }

