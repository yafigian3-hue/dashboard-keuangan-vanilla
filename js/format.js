function rupiah(num) {
  return new Intl.NumberFormat("ID-id", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}
