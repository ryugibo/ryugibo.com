import { useSearchParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type ProductPaginationProps = {
  totalPages: number;
};

export function ProductPagination({ totalPages }: ProductPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const onClick = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };
  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious
                onClick={(event) => {
                  event.preventDefault();
                  onClick(page - 1);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={(event) => {
                  event.preventDefault();
                  onClick(page - 1);
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationLink
            onClick={(event) => {
              event.preventDefault();
              onClick(page);
            }}
            isActive
          >
            {page}
          </PaginationLink>
        </PaginationItem>
        {page < totalPages && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={(event) => {
                  event.preventDefault();
                  onClick(page + 1);
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
            {page + 1 < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={(event) => {
                  event.preventDefault();
                  onClick(page + 1);
                }}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
