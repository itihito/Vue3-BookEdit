type Book = {
  uid: string;
  seq: number;
  bookId: string;
  title: string;
  description: string;
  image: string;
  date: string;
  dateTime: string;
  memo: string;
};

type SearchResultBook = {
  bookId: string;
  title: string;
  description: string;
  image: string;
  isAdded: boolean;
};

// まとめてエクスポート
export type { Book, SearchResultBook };
