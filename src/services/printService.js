import { pdf } from "@react-pdf/renderer";

export const print = async (doc, fun, anotherFun) => {
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  // const link = document.createElement('a')

  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  iframe.style.display = "none";
  iframe.src = url;
  iframe.onload = function () {
    setTimeout(function () {
      iframe.focus();
      iframe.contentWindow?.print();
    }, 1);
  };
  fun();
  anotherFun();
};
