type Book = {
  seq: number;
  bookId: string;
  title: string;
  description: string;
  image: string;
  readDate: string;
  memo: string;
};

type UpdateBookInfo = {
  seq: number;
  readDate: string;
  memo: string;
};

type SearchResultBook = {
  bookId: string;
  title: string;
  description: string;
  image: string;
  readDate: string;
  isAdded: boolean;
};

// まとめてエクスポート
export type { Book, UpdateBookInfo, SearchResultBook };
