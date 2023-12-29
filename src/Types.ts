export type Book = {
  seq: number;
  bookId: string;
  title: string;
  description: string;
  image: string;
  readDate: string;
  memo: string;
};

export type UpdateBookInfo = {
  seq: number;
  readDate: string;
  memo: string;
};

export type SearchResultBook = {
  bookId: string;
  title: string;
  description: string;
  image: string;
  readDate: string;
  isAdded: boolean;
};
