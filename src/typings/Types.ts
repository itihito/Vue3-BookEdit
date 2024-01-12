type Book = {
  uid: string;
  seq: number;
  bookId: string;
  title: string;
  description: string;
  image: string;
  date: string;
  memo: string;
  author: string;
  publisher: string;
  publishedDate: string;
  language: string;
  printedPageCount: string;
  createdAt: string;
  updatedAt: string;
};

type SearchResultBook = {
  bookId: string;
  title: string;
  description: string;
  image: string;
  publishedDate: string;
  isAdded: boolean;
};

type BookDetailInfo = {
  label: string;
  value: string;
};

type BooksProps = {
  books: Book[];
  uid: string;
};

type BookDetailProps = {
  bookDetailInfo: BookDetailInfo[];
};

type SortBookProperties = {
  label: string;
  sortKey: keyof Book;
  order: "desc" | "asc";
};

type SortSearchResultBookProperties = {
  label: string;
  sortKey: keyof SearchResultBook;
  order: "desc" | "asc";
};

// まとめてエクスポート
export type {
  Book,
  SearchResultBook,
  BookDetailInfo,
  BooksProps,
  BookDetailProps,
  SortBookProperties,
  SortSearchResultBookProperties,
};
