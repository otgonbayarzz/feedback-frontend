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

const apiService = new ApiService();

export default function home(props) {
  const [activePage, setActivePage] = useState(1);
  const [allPageNumber, setAllPageNumber] = useState([]);
  const [perPage, setPerPage] = useState(20);
  const [companys, setCompanys] = useState([]);

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

  const loadData = async (pageNumber, per_page, keyword) => {
    const resp = await apiService.getCompany();
    if (resp.success) {
      setCompanys(resp.data);
    } else {
    }
  };
  const changePage = async (number) => {
    let tmp = activePage;
    if (number.toString() === "back" && activePage > 1) {
      tmp = tmp - 1;
      setActivePage(tmp);
      await loadData(tmp, perPage);
    }
    if (
      number.toString() === "forward" &&
      activePage < Math.max(...allPageNumber)
    ) {
      tmp = tmp + 1;
      setActivePage(tmp);
      await loadData(tmp, perPage);
    }
    if (number.toString() !== "forward" && number.toString() !== "back") {
      setActivePage(number);
      await loadData(number, perPage);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Row style={{ marginTop: "50px" }}>
          <Col xs={12} style={{ marginTop: "26px" }}>
            <Form.Control style={{ borderRadius: "16px" }} type="text" />
          </Col>
          <Row style={{ width: "100%" }}>
            <Col xs={12} style={{ marginTop: "26px" }}>
              {companys && companys.length > 0 && (
                <>
                  <h4> Prospects</h4>
                </>
              )}
            </Col>

            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Industry</th>
                  <th>Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companys &&
                  companys.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.phone}</td>
                      <td>{item.industry}</td>
                      <td>{item.info}</td>
                      <td></td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Row>

          <Row style={{ width: "100%" }}>
            <Col xs={12} style={{ marginTop: "26px" }}>
              {companys && companys.length > 0 && (
                <>
                  <h4> Companies</h4>
                </>
              )}
            </Col>

            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Industry</th>
                  <th>Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companys &&
                  companys.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.phone}</td>
                      <td>{item.industry}</td>
                      <td>{item.info}</td>
                      <td></td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Row>

          <style jsx>{`
            .box {
            }
          `}</style>

          <style jsx global>{``}</style>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
}
