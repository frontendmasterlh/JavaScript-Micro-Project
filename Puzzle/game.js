let gameConfig = {
  width: 608,
  height: 403,
  rows: 3,
  cols: 3,
  imgUrl: "img/1.jpg",
  dom: document.getElementById("game"),
  isOver: false,
};

const blocks = [];

// 设置每一个小方块的宽和高
gameConfig.pieceWidth = gameConfig.width / gameConfig.cols;
gameConfig.pieceHeight = gameConfig.height / gameConfig.rows;

// 设置小方块的数量
gameConfig.pieceNumber = gameConfig.rows * gameConfig.cols;

// 小方块的类
class Block {
  constructor(left, top, isVisible) {
    this.left = left;
    this.top = top;
    this.correctLeft = left; // 正确的横坐标
    this.correctTop = top; // 正确的纵坐标
    this.dom = document.createElement("div");
    this.dom.style.width = gameConfig.pieceWidth + "px";
    this.dom.style.height = gameConfig.pieceHeight + "px";
    this.dom.style.background = `url("${gameConfig.imgUrl}") -${this.correctLeft}px -${this.correctTop}px`;
    this.dom.style.position = "absolute";
    this.dom.style.border = "1px solid #fff";
    this.dom.style.boxSizing = "border-box";
    this.dom.style.cursor = "pointer";
    this.isVisible = isVisible;
    if (!isVisible) {
      this.dom.style.display = "none";
    }
    gameConfig.dom.appendChild(this.dom);
    this.show(left, top);
  }
  /**
   * 根据当前的left、top，重新设置div的位置
   * @param {*} left
   * @param {*} top
   */
  show(left, top) {
    this.dom.style.left = left + "px";
    this.dom.style.top = top + "px";
  }
  /**
   * 判断方块是否位于正确的位置
   * @returns
   */
  isCorrect() {
    return (
      isEqual(this.left, this.correctLeft) && isEqual(this.top, this.correctTop)
    );
  }
}
/**
 * 比较两个数是否相等
 * @param {*} a
 * @param {*} b
 * @returns
 */
const isEqual = (a, b) => parseInt(a) === parseInt(b);
/**
 * 判断游戏是否获胜
 */
const isWin = () => {
  let result = blocks.every((block) => block.isCorrect());

  if (result) {
    blocks.forEach((b) => {
      b.dom.style.border = "none";
      if (!b.isVisible) {
        b.dom.style.display = "block";
      }
    });
    gameConfig.isOver = true;
  }
};
/**
 * 初始化整个游戏的外观样式
 */
const initGamesDom = () => {
  gameConfig.dom.style.width = gameConfig.width + "px";
  gameConfig.dom.style.height = gameConfig.height + "px";
  gameConfig.dom.style.border = "2px solid #ccc";
  gameConfig.dom.style.position = "relative";
};

/**
 * 准备好一个数组，数组的每一项是一个对象，纪录了每一个小方块的信息
 */
const initBlocksArray = () => {
  for (let i = 0; i < gameConfig.rows; i++) {
    for (let j = 0; j < gameConfig.cols; j++) {
      let isVisible = true;
      if (i === gameConfig.rows - 1 && j == gameConfig.cols - 1) {
        isVisible = false;
      }
      const block = new Block(
        j * gameConfig.pieceWidth,
        i * gameConfig.pieceHeight,
        isVisible
      );
      blocks.push(block);
    }
  }
};

/**
 * 得到介于[min,max]的随机数
 * @param {*} min
 * @param {*} max
 * @returns
 */
const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};
/**
 * 交换两个方块的left和top，并且显示两个方块交换后的位置
 * @param {*} b1
 * @param {*} b2
 */
const exchange = (b1, b2) => {
  let temp = b1.left;
  b1.left = b2.left;
  b2.left = temp;

  temp = b1.top;
  b1.top = b2.top;
  b2.top = temp;

  b1.show(b1.left, b1.top);
  b2.show(b2.left, b2.top);
};
/**
 * 打乱小方块的位置
 */
const shuffle = () => {
  for (let i = 0; i < blocks.length - 1; i++) {
    //   随机生成一个下标
    const index = getRandom(0, blocks.length - 2);
    // 当前数组的left和top 和随机下标的数组的left和top交换
    exchange(blocks[i], blocks[index]);
  }
  // blocks.forEach((block) => block.show(block.left, block.top));
};

//   注册点击事件
const regEvent = () => {
  let inVisibleBlock = blocks.find((b) => !b.isVisible);

  blocks.forEach((b) => {
    b.dom.onclick = function () {
      if (gameConfig.isOver) {
        return;
      }

      if (
        (isEqual(b.left, inVisibleBlock.left) &&
          isEqual(
            Math.abs(b.top - inVisibleBlock.top),
            gameConfig.pieceHeight
          )) ||
        (isEqual(b.top, inVisibleBlock.top) &&
          isEqual(
            Math.abs(b.left - inVisibleBlock.left),
            gameConfig.pieceWidth
          ))
      ) {
        // 交换点击的block和看不见的方块的left和top
        exchange(b, inVisibleBlock);
      } else {
        return;
      }
      //   exchange(b, inVisibleBlock);
      isWin();
    };
  });
};
const init = () => {
  // 1. 初始化游戏容器
  initGamesDom();
  // 2. 初始化小方块
  initBlocksArray();
  // 3. 打乱小方块的位置
  shuffle();
  // 4. 给小方块注册点击事件
  regEvent();
};

init();
