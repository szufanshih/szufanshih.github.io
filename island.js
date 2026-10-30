/* =====================================================================
   岛和岛上的东西
   以后新增单元，通常只要改这个档案：
   - 在地点（places）里加一个 { zh, py, en, x, y, color, games: [...] }
   - games 里每个游戏是：{ zh, py, en, note, href }
     href 写「玩法 + 单元资料夹」，例如：
       'games/match.html?unit=family'   家人配对
       'games/tree.html?unit=family'    家族树
       'games/board.html?unit=family'   大富翁
   - 每座岛有自己的地图。每个地点有一块牌子，x / y 是牌子在地图上的位置
     （两座岛的地图都是宽 1240、高 620）。
   - 点牌子会跳出这个地点的游戏选单（games）。
     还没有游戏的地点，牌子是虚线、写 Coming soon，点了不会有反应。
   - id：有游戏的地点要有一个英文 id（小写、用 - 连接），游戏里的「回到地点」按钮会用到。
   - labelOnly: true 的地点只是岛上的名牌（例如卫生间、饮水机），不会有游戏。
   - color：'me' 绿、'dad' 橘、'mom' 粉红、'sea' 蓝、'sun' 黄、'night' 紫
   ===================================================================== */
window.ISLANDS = {
  main: {
    zh: '史老师的中文游戏岛', py: 'shǐ lǎo shī de zhōng wén yóu xì dǎo', en: "Ms. Shih's Island of Chinese Games", width: 1240,
    places: [
      { id: 'family', zh: '家', py: 'jiā', en: 'Family', x: 765, y: 92, color: 'dad',
        games: [
          { zh: '家族树', py: 'jiā zú shù', en: 'Family Tree', note: 'Drag the words onto the tree, 4 levels', href: 'games/tree.html?unit=family' },
          { zh: '家人配对', py: 'jiā rén pèi duì', en: 'Family Matching', note: 'Match Chinese and English, 4 levels', href: 'games/match.html?unit=family' },
          { zh: '家庭大富翁', py: 'jiā tíng dà fù wēng', en: 'Family Board Game', note: 'Roll the dice and ask 你有……吗？', href: 'games/board.html?unit=family' }
        ] },
      { zh: '学校', py: 'xué xiào', en: 'School', x: 265, y: 296, color: 'mom', games: [] },
      { zh: '卫生间', py: 'wèi shēng jiān', en: 'Restroom', x: 470, y: 140, labelOnly: true },
      { zh: '饮水机', py: 'yǐn shuǐ jī', en: 'Water Fountain', x: 414, y: 384, labelOnly: true },
      { zh: '你好吗', py: 'nǐ hǎo ma', en: 'How are you?', x: 193, y: 548, color: 'sea', games: [] },
      { zh: '数字', py: 'shù zì', en: 'Numbers', x: 872, y: 520, color: 'sun', games: [] }
    ]
  },
  holiday: {
    zh: '节日岛', py: 'jié rì dǎo', en: 'Holiday Island', width: 1240,
    places: [
      { id: 'haunted-house', zh: '鬼屋', py: 'guǐ wū', en: 'Haunted House', x: 540, y: 110, color: 'night',
        games: [
          { zh: '鬼屋窗户', py: 'guǐ wū chuāng hu', en: 'Haunted House Windows', note: '鬼屋里有什么？ Open a window and answer', href: 'games/windows.html?unit=halloween' },
          { zh: '我看到', py: 'wǒ kàn dào', en: 'I See', note: '你看到什么？ Drag the word into the sentence', href: 'games/spy.html?unit=halloween' },
          { zh: '化妆舞会', py: 'huà zhuāng wǔ huì', en: 'Costume Party', note: '我要当＿＿ Drag each name to the costume', href: 'games/dressup.html?unit=halloween' },
          { zh: '我怕／我不怕', py: 'wǒ pà / wǒ bú pà', en: "I'm afraid / I'm not afraid", note: 'Build the sentence', href: 'games/afraid.html?unit=halloween' }
        ] },
      { zh: '感恩节市场', py: 'gǎn ēn jié shì chǎng', en: 'Thanksgiving Market', x: 950, y: 170, color: 'dad', games: [] }
    ]
  }
};
