import { useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Form,
  Pagination,
  ButtonGroup,
  Table,
} from "react-bootstrap";
import Router, { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import ApiService from "../utils/api";
import Header from "./layout/header";
import React from "react";
import qee from "qf-export-excel"
import moment from 'moment'
import * as Icon from 'react-bootstrap-icons';
import ReactPaginate from 'react-paginate';

const apiService = new ApiService();

export default function home(props) {
  const [activePage, setActivePage] = useState(1);
  const [allPageNumber, setAllPageNumber] = useState([]);
  const [perPage, setPerPage] = useState(50);
  const [companys, setCompanys] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [products, setProducts] = useState([]);
  const [branch, setBranch] = useState([]);
  const [sBranch, setSbranch] = useState("");
  const [sProduct, setSproduct] = useState("");
  const [sDate, setSdate] = useState("");
  const [eDate, setEdate] = useState("");
  const [constValue, setConstvalue] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);



  let titleList = [{
    key: 'Index',
    title: '№',
  }, {
    key: 'SaleNo',
    title: 'Гүйлгээний дугаар',
  }, {
    key: 'StationName',
    title: 'Салбарын нэр',
  },
  {
    key: 'NozzleNo',
    title: 'Хошууны дугаар',
  },
  {
    key: 'ItemName',
    title: 'Бүтээгдэхүүн',
  },
  {
    key: 'UnitPrice',
    title: 'Нэгжийн үнэ',
  },
  {
    key: 'Quantity',
    title: 'Тоо Хэмжээ',
  },
  {
    key: 'CardAmount',
    title: 'Картаар төлсөн',
  },
  {
    key: 'CashAmount',
    title: 'Бэлнээр төлсөн',
  },

  {
    key: 'SaleDate',
    title: 'Гүйлгээний хугацаа',
  }

  ]

  const expo = () => {
    qee(titleList, exportData, "Тайлан.xls")
  }

  React.useEffect(() => {
    if (!localStorage.getItem("Authorization")) {
      //   Router.push("/login");
    }
    try {
      async function fetchData() {
        await loadData(activePage, perPage);
      }
      fetchData();
    } catch (err) {
      console.log("err occured: ", err);
    }
  }, []);

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const loadData = async (pageNumber, perPage, stationNo, itemName, startDate, endDate) => {
    const resp = await apiService.getCompany(pageNumber, perPage, stationNo, itemName, startDate, endDate);
    if (resp.success) {
      let tmp = []
      tmp = resp.data;
      tmp.map((i, idx) => {
        i.Index = idx + 1;
        i.SaleDate = moment.utc(i.SaleDate).format("YYYY-MM-DD HH:mm");
      })

      setCompanys(tmp);
      setConstvalue(tmp);

      let tmpExport = resp.exportData;
      tmpExport.map((i, idx) => {
        i.Index = idx + 1;
        i.SaleDate = moment.utc(i.SaleDate).format("YYYY-MM-DD HH:mm");
      })
      setExportData(tmpExport)
      let tmp1 = [...new Set(tmp.map(i => i.ItemName))];
      let tmp2 = [...new Set(tmp.map(i => i.StationName))];
      setProducts(tmp1);
      setBranch(tmp2);
      console.log("all", tmpExport.length)
      console.log("fetch", tmp.length)

      let ta = tmpExport.map(i => {
        return parseFloat(i.CashAmount);
      })
      let tv = tmpExport.map(i => {
        return parseFloat(i.Quantity);
      })
      

      let tmpInt = parseFloat("0");
      let tmpFloat = parseFloat("0");
      for (let k = 0; k < ta.length; k += 1) {
        tmpInt = tmpInt + ta[k];
      }
      
      for (let k = 0; k < tv.length; k += 1) {
        tmpFloat = tmpFloat + tv[k];
      }
      console.log(tv.length, tmpFloat)
      console.log(ta.length, tmpInt)
      setTotalAmount(tmpInt);
      setTotalValue(tmpFloat)
      
      let bbb = [];
      if (resp.cnt > 50 && resp.cnt < 100)
        bbb = [1, 2]
      else {
        let tst = Math.floor(resp.cnt / 50)
        for (let k = 1; k <= tst + 1; k += 1) {
          bbb.push(k)
        }
      }
      setAllPageNumber(bbb)
      setActivePage(pageNumber);



    }
  };

  const handlePageClick = (data) => {
   
      changePage(data.selected + 1);
   

  };


  const changePage = async (number) => {

    let tmp = activePage;
    if (number.toString() === "back" && activePage > 1) {
      tmp = tmp - 1;

      await loadData(tmp, perPage, branch, sProduct, sDate, eDate)
    }
    if (
      number.toString() === "forward" &&
      activePage < Math.max(...allPageNumber)
    ) {
      tmp = tmp + 1;

      await loadData(tmp, perPage, branch, sProduct, sDate, eDate)
    }
    if (number.toString() !== "forward" && number.toString() !== "back") {
      let tmp = number;
      await loadData(tmp, perPage, branch, sProduct, sDate, eDate)
    }
  };

  const changeValue = (type, value) => {
    if (type === "p") { setSproduct(value) }
    if (type === "b") { setSbranch(value) }
    if (type === "s") {

      setSdate(value)
    }
    if (type === "e") {
      setEdate(value)
    }

  }
  const filteData = async () => {
    await loadData(1, perPage, branch, sProduct, sDate, eDate)
  }

  const clearData = async () => {

    await loadData(1, 0, "", "", "", "")
    setSbranch("")
    setSproduct("")
    setSdate("")
    setEdate("")

  }


  return (
    <>
      <Header />
      <Container>
        <Row style={{ marginTop: "50px" }}>
          <Row style={{ width: "100%" }}>
            <Col xs={12} style={{ marginTop: "26px" }}>
              {companys && companys.length > 0 && (
                <>
                  <h4> Гүйлгээнүүд</h4>
                </>
              )}
            </Col>

            <Col xs={12} md={2} style={{ marginTop: "26px", float: "right" }}>
              <Form.Control as="select" value={sBranch}
                onChange={e => {
                  changeValue("b", e.target.value);

                }}
              >
                <option > Салбар сонгох  </option>
                {branch &&
                  branch.map((item, index) => (
                    <>
                      <option value={item}> {item} </option>
                    </>
                  ))}
              </Form.Control>
            </Col>
            <Col xs={12} md={2} style={{ marginTop: "26px", float: "right" }}>
              <Form.Control as="select" value={sProduct}
                onChange={e => {
                  changeValue("p", e.target.value);
                }}
              >
                <option > Бүтээгдэхүүн сонгох  </option>
                {products &&
                  products.map((item, index) => (
                    <>
                      <option value={item}> {item} </option>
                    </>
                  ))}
              </Form.Control>
            </Col>
            <Col xs={12} md={2} style={{ marginTop: "26px", float: "right" }}>
              <Form.Control value={sDate} placeholder="Эхлэх Өдөр сонгох" style={{ borderRadius: "16px" }} type="date"
                onChange={e => {
                  changeValue("s", e.target.value);
                }}
              />
            </Col>
            <Col xs={12} md={2} style={{ marginTop: "26px", float: "right" }}>
              <Form.Control value={eDate} placeholder="Дуусах Өдөр сонгох" style={{ borderRadius: "16px" }} type="date"
                onChange={e => {
                  changeValue("e", e.target.value);
                }}
              />
            </Col>

            <Col xs={12} md={1} style={{ marginTop: "26px", float: "right" }}>
              <Button variant="secondary" onClick={filteData}  > Шүүх </Button>
            </Col>
            <Col xs={12} md={1} style={{ marginTop: "26px", float: "right" }}>
              <Button variant="secondary" onClick={clearData}  > Цэвэрлэх </Button>
            </Col>
            <Col xs={12} md={2} style={{ marginTop: "26px", float: "right" }}>
              <Button onClick={expo} > <Icon.FileEarmarkExcel />{'  '}Татах</Button>
            </Col>
            <Col xs={12} md={12} style={{ marginTop: "26px", float: "right" }} >
              <p style={{ float: "right" }}>
                Нийт хэмжээ : <b> {totalValue ? totalValue.toFixed(2) : 0}л </b> {' '}
                Нийт мөнгөн дүн : <b> {totalAmount ? totalAmount.toFixed(2) : 0}₮ {' '} </b>
              </p>
            </Col>
            <Col xs={12} style={{ marginTop: "26px" }}>

              <Table striped bordered hover size="md">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>№</th>
                    <th style={{ textAlign: "center" }}>Гүйлгээний дугаар</th>
                    <th style={{ textAlign: "center" }}>Салбарын нэр</th>
                    <th style={{ textAlign: "center" }}>Хошууны дугаар </th>
                    <th style={{ textAlign: "center" }}>Бүтээгдэхүүн</th>
                    <th style={{ textAlign: "center" }}>Нэгжийн үнэ</th>
                    <th style={{ textAlign: "center" }}>Тоо Хэмжээ</th>
                    <th style={{ textAlign: "center" }}>Картаар төлсөн</th>
                    <th style={{ textAlign: "center" }}>Бэлнээр төлсөн</th>

                    <th style={{ textAlign: "center" }}>Гүйлгээний хугацаа</th>
                  </tr>
                </thead>
                <tbody>
                  {companys &&
                    companys.map((item, index) => (
                      <tr>
                        <td style={{ textAlign: "center" }}>{index + (activePage - 1) * perPage + 1}</td>
                        <td style={{ textAlign: "center" }}>{item.SaleNo}</td>
                        <td style={{ textAlign: "center" }}>{item.StationName}</td>
                        <td style={{ textAlign: "center" }}>{item.NozzleNo}</td>
                        <td style={{ textAlign: "center" }}>{item.ItemName}</td>
                        <td style={{ textAlign: "center" }}>{item.UnitPrice}</td>
                        <td style={{ textAlign: "center" }}>{item.Quantity}</td>
                        <td style={{ textAlign: "center" }}>{item.CardAmount}</td>
                        <td style={{ textAlign: "center" }}>{item.CashAmount}</td>

                        <td style={{ textAlign: "center" }}>{item.SaleDate}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              {allPageNumber && (
                <ReactPaginate
                  previousLabel={'<'}
                  nextLabel={'>'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={allPageNumber.length}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  containerClassName={'pagination__'}
                  activeClassName={'active'}
                  onPageChange={handlePageClick}
                />
                // <Pagination>
                //   <Pagination.Prev
                //     onClick={() => {
                //       changePage("back")
                //     }} />
                //   { allPageNumber.map((item, index) => (
                //     < Pagination.Item key={item} active={activePage === item ? true : false}
                //       onClick={() => {
                //         changePage(item)
                //       }}
                //     > {item} </Pagination.Item>
                //   ))}
                //   < Pagination.Next
                //     onClick={() => {
                //       changePage("forward")
                //     }}
                //   />

                // </Pagination>
              )}


              {/* <Pagination>

                {allPageNumber && allPageNumber.map((item, index) => (

                  < Pagination.Item key={item}
                    onClick={() => {
                      loadData(item, perPage, branch, sProduct, sDate, eDate)
                    }}
                  > {item} </Pagination.Item>
                ))}


              </Pagination> */}
            </Col>
          </Row>

          <style jsx>{`
            .box {
            }
          `}</style>

          <style jsx global>{``}</style>
        </Row>
        <ToastContainer />
      </Container >
    </>
  );
}
