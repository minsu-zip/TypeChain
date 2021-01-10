import * as CryptoJS from "crypto-js";

//블록체인 구조
class Block {
  //새로운 블록체인 만드는 구조
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.data === "string" &&
    typeof aBlock.timestamp === "number";

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  //생성자
  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

//초기 블록체인
const genesisBlock: Block = new Block(0, "202020", "", "Hello", 123456);
//블록 배열
let blockchain: Block[] = [genesisBlock];
//블록전체 가져오기
const getBlockchain = (): Block[] => blockchain;
//마지막 블록 가져오기
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
//랜덤값
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

//새로운 블록체인 만드는 함수
const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );

  //새로운 블럭 생성
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimestamp
  );
  addBlock(newBlock);
  return newBlock;
};

//만들려고하는 블럭이 올바른 타입이고 이전 블럭과 비교해서 정상적인 블록연결인지 검증
const isBlockVaild = (candidateBlock: Block, previousBlock: Block): boolean => {
  //구조 검증 및 이전 블럭과 비교를 통해 블럭값 검증
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockVaild(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
  }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export {};
