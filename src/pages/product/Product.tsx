import { useCallback, useEffect, useMemo, useState } from "react";
import { apiConfig } from "../../axios";
import InputField from "../../components/shared/InputField";
import Button from "../../components/shared/Button";
import Card from "../../components/shared/Card/Card";
import { debounce } from "lodash";
import { RotateCcw, ShieldCheck, Truck, X } from "lucide-react";

export interface Product {
  availabilityStatus: string;
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  id: number;
  images: string[];
  minimumOrderQuantity: number;
  price: number;
  rating: number;
  returnPolicy: string;
  shippingInformation: string;
  sku: string;
  stock: number;
  tags: string[];
  thumbnail: string;
  title: string;
  warrantyInformation: string;
  weight: number;
}

interface ProductDetail {
  limit: number;
  skip: number;
  total: number;
  products: Array<Product>;
}

const pageSize = 10;
const Product = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [saveItems, setsaveItems] = useState<Product[]>([]);
  const [searchItems, setsearchItems] = useState<string>("");
  const [productDetail, setproductDetail] = useState<ProductDetail | null>(
    null,
  );
  const [perticularProductDetail, setPerticularProductDetail] =
    useState<Product | null>(null);

  const getProduct = useCallback(
    async ({ skip, search }: { skip: number; search?: string }) => {
      const responce = await apiConfig.get(
        `products/search?q=${search ?? ""}&limit=${pageSize}&skip=${skip}`,
      );

      setproductDetail(responce.data);
    },
    [],
  );

  const handleSearch = useMemo(() => debounce(getProduct, 1000), []);
  useEffect(() => {
    getProduct({ skip: 0 });

    const allItems = localStorage.getItem("saveItem");
    if (allItems) {
      const parshItem: Product[] = JSON.parse(allItems);
      setsaveItems(parshItem);
    }
  }, []);

  const totalPage = !!productDetail
    ? Math.ceil(
        productDetail.total /
          (productDetail.limit >= pageSize ? productDetail.limit : pageSize),
      )
    : 0;

  return (
    <div className="p-7">
      <div className=" text-center">
        <InputField
          onChange={(value) => {
            setsearchItems(value);
            handleSearch({ skip: 0, search: value });
          }}
          type="search"
          placeholder="Search Product"
          className="border mb-5 w-[50%]"
        />
      </div>
      <div className="  grid gap-6 grid-cols-5">
        {productDetail?.products.map((ele, idx) => {
          return (
            <div
              key={idx}
              onClick={() => {
                (setIsOpen(true), setPerticularProductDetail(ele));
              }}
            >
              <Card className="hover:-translate-y-2 transition-transform cursor-pointer">
                <img
                  src={ele.images[0]}
                  draggable="false"
                  alt={`${ele.title}`}
                />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500">
                    {ele.brand}
                  </p>
                  <p className="line-clamp-1 font-semibold">{ele.title}</p>
                  <p className="text-sm">⭐ {ele.rating}</p>
                  <p className="font-semibold flex justify-between text-slate-600">
                    $
                    {(
                      ele.price -
                      (ele.price * ele.discountPercentage) / 100
                    ).toFixed(2)}
                    <span className="text-md text-slate-400 line-through">
                      ${ele.price}{" "}
                    </span>
                  </p>
                  <p className="text-green-500 font-semibold">
                    {ele.availabilityStatus}
                  </p>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
      <div className=" flex gap-2 mt-10 justify-center ">
        <Button
          isDisable={!productDetail?.skip}
          className="h-10 w-10 bg-gray-500! hover:bg-gray-600!"
          onClick={() => {
            !!productDetail &&
              getProduct({
                skip: productDetail.skip - pageSize,
                search: searchItems,
              });
          }}
          type="button"
          btnTxt="<"
        />
        <div className="flex flex-wrap gap-2 ">
          {!!productDetail &&
            Array.from(
              {
                length: totalPage,
              },
              (_, idx) => {
                const page = idx + 1;
                const currentPage = (page - 1) * pageSize == productDetail.skip;
                const prevPage =
                  (page - 1) * pageSize == productDetail.skip - 10;
                const nextPage =
                  (page - 1) * pageSize == productDetail.skip + 10;
                const firstFive =
                  productDetail.skip <= 30 && (page - 1) * pageSize <= 40;

                const lastFive =
                  productDetail.skip >= Math.ceil(productDetail.total) - 40 &&
                  (page - 1) * pageSize >= Math.ceil(productDetail.total) - 50;

                const paginatedButtons =
                  idx == 0 ||
                  idx == totalPage - 1 ||
                  currentPage ||
                  firstFive ||
                  lastFive ||
                  prevPage ||
                  nextPage;

                return paginatedButtons ? (
                  <Button
                    key={idx}
                    onClick={() => {
                      getProduct({
                        skip: (page - 1) * pageSize,
                        search: searchItems,
                      });
                    }}
                    className={`${currentPage ? "h-10 w-10 bg-gray-800! hover:bg-gray-600!" : "bg-gray-400! hover:bg-gray-600! h-10 w-10"}`}
                    type="button"
                    btnTxt={page}
                  />
                ) : idx == 2 || idx == totalPage - 2 ? (
                  <div key={idx} className="text-3xl text-gray-700">
                    ...
                  </div>
                ) : null;
              },
            )}
        </div>
        <Button
          isDisable={!!productDetail && productDetail.limit < pageSize}
          onClick={() => {
            !!productDetail &&
              getProduct({
                skip: productDetail.skip + pageSize,
                search: searchItems,
              });
          }}
          className="h-10 w-10 bg-gray-500! hover:bg-gray-600!"
          type="button"
          btnTxt=">"
        />
      </div>
      {isOpen ? (
        <div
          onClick={() => {
            setIsOpen(false);
            setPerticularProductDetail(null);
          }}
          className="fixed inset-0 h-screen bg-black/50"
        >
          <dialog
            open
            className="bg-blue-50 fixed inset-20 mx-auto p-7  shadow-2xl rounded-2xl z-50"
          >
            <div>
              <img
                src={`${perticularProductDetail?.images[0]}`}
                className="h-40 w-40"
                alt=""
              />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-400">
                {perticularProductDetail?.brand}
              </p>
              <h1 className="font-bold text-lg mt-2">
                {perticularProductDetail?.title}
              </h1>
              <p className="text-sm">
                ⭐ {perticularProductDetail?.rating} |{" "}
                {perticularProductDetail?.sku}
              </p>
              <p className=" text-red-600 font-bold text-lg flex justify-between items-center mt-2">
                $
                {!!perticularProductDetail?.price &&
                  (
                    perticularProductDetail?.price -
                    (perticularProductDetail?.price *
                      perticularProductDetail?.discountPercentage) /
                      100
                  ).toFixed(2)}
                <span className="line-through text-sm text-gray-500">
                  {" "}
                  ${perticularProductDetail?.price}{" "}
                </span>
                <span className="border-red-400 bg-red-200 p-1 rounded-2xl text-sm">
                  {perticularProductDetail?.discountPercentage}% OFF
                </span>
              </p>
              <p className="text-sm font-bold mt-2">
                Availability:{" "}
                <span className="font-medium">
                  {perticularProductDetail?.availabilityStatus}
                </span>
                <span>({perticularProductDetail?.stock} Availabile)</span>
              </p>
              <p className="flex gap-2 font-light text-sm mt-2">
                <Truck size={"16px"} />
                {perticularProductDetail?.shippingInformation}
              </p>
              <p className="flex gap-2 font-light text-sm">
                <ShieldCheck size={"16px"} />{" "}
                {perticularProductDetail?.warrantyInformation}
              </p>
              <p className="flex gap-2 font-light text-sm">
                <RotateCcw size={"16px"} />{" "}
                {perticularProductDetail?.returnPolicy}
              </p>
            </div>
            <button
              className="cursor-pointer absolute top-7 right-7   rounded-full active:scale-95 p-1 bg-[#011f44]  font-semibold"
              onClick={() => {
                setIsOpen(false);
                setPerticularProductDetail(null);
              }}
            >
              <X size={18} style={{ color: "white" }} />
            </button>
            <button
              onClick={() => {
                if (!perticularProductDetail) return;
                setsaveItems((saveItem) => {
                  const cartItem = [...saveItem, perticularProductDetail];
                  localStorage.setItem("saveItem", JSON.stringify(cartItem));
                  return cartItem;
                });
              }}
              className="cursor-pointer mt-2 w-full active:scale-95  text-sm text-white border rounded py-2 bg-[#011f44]  font-semibold"
            >
              Add To Cart
            </button>
          </dialog>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Product;
