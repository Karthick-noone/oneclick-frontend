import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ApiUrl } from "../../components/ApiUrl";
import "./css/BranchManagement.css";
import { ChevronLeft, ChevronRight, Eye, X, Search, Box } from "lucide-react";
import axios from 'axios';
const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  // Add these states at the top
  const [pendingPage, setPendingPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive

  const [currentPage, setCurrentPage] = useState(1);
  const tableRowsPerPage = 10;
  const indexOfLastRow = currentPage * tableRowsPerPage;
  const indexOfFirstRow = indexOfLastRow - tableRowsPerPage;
  const currentRows = selectedProducts.slice(indexOfFirstRow, indexOfLastRow);
  const [title, setTitle] = useState("")

  const [showBulkApprove, setShowBulkApprove] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  // const [selectAll, setSelectAll] = useState(false);

  const totalPages = Math.ceil(selectedProducts.length / tableRowsPerPage);

  const openProductModal = (branchId, filterStatus = null, title = null) => {  // default null
    const branchProducts = products.filter(p => p.branch_id === branchId);
    const filteredProducts = filterStatus
      ? branchProducts.filter(p => p.productStatus === filterStatus)
      : branchProducts;

    setSelectedProducts(filteredProducts);
    setCurrentPage(1);
    setShowProductModal(true);
    setTitle(title);      // title = null for box1 and has text for box2
    setShowBulkApprove(false);
    setSelectedIds([]);
  };



  const closeProductModal = () => {
    setSelectedProducts([]);
    setShowProductModal(false);
    setShowBulkApprove(false);   // ❌ your code was toggling
    setSelectedIds([]);          // reset
  };


  const openModal = (branch) => {
    setSelectedBranch(branch);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBranch(null);
    setShowModal(false);
  };


  const handleApprove = async (ids) => {
    try {
      const newStatus = "approved";

      await Promise.all(
        ids.map(prodId =>
          axios.post(
            `${ApiUrl}/product-status/update`,
            { prod_id: prodId, productStatus: newStatus },
            { timeout: 5000 }
          )
        )
      );

      //  success toast
      toast.success("Products approved successfully!");

      // reset states
      setSelectedIds([]);
      setShowBulkApprove(false);

      //  close modal
      setShowProductModal(false);

      //  call your fetchProducts function here
      fetchProducts(); // ← make sure this exists at component level

    } catch (err) {
      console.error("❌ Error approving products:", err);
      toast.error("Failed to approve products!");
    }
  };

  //  Fetch all branches
  const fetchBranches = async () => {
    try {
      const res = await fetch(`${ApiUrl}/api/branch/get-all`);
      const data = await res.json();
      console.log("branches", data.branches)

      if (res.ok) {
        setBranches(data.branches || []);
      } else {
        toast.error(data.message || "Failed to fetch branches");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not fetch branches");
    }
  };

  //  Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${ApiUrl}/api/branch/branch-products`);
      const data = await res.json();
      console.log("Products", data)
      if (res.ok) {
        setProducts(data.products || []);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not fetch products");
    }
  };

  //  Fetch both branches and products on load
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchBranches(), fetchProducts()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  //  Enrich branches with product counts
  const enrichedBranches = branches.map((branch) => {
    const branchProducts = products.filter((p) => p.branch_id === branch.id);
    return {
      ...branch,
      no_of_products: branchProducts.length,
      approval_waiting_products: branchProducts.filter(
        (p) => p.productStatus === "unapproved"
      ).length,
    };
  });

  //  Toggle branch status
  const toggleStatus = async (branchId, currentStatus) => {
    try {
      const res = await fetch(`${ApiUrl}/api/branch/toggle-status/${branchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: currentStatus === "active" ? "inactive" : "active",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Status updated");
        fetchBranches()
        closeModal()
        setBranches((prev) =>
          prev.map((b) =>
            b.id === branchId
              ? {
                ...b,
                status: data.status,
                joined_date:
                  data.status === "active"
                    ? data.approved_date || b.joined_date
                    : b.joined_date,
              }
              : b
          )
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not update status");
    }
  };


  //  Delete branch
  const deleteBranch = async (branchId) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    try {
      const res = await fetch(`${ApiUrl}/api/branch/delete/${branchId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Branch deleted");
        setBranches((prev) => prev.filter((b) => b.id !== branchId));
      } else {
        toast.error(data.message || "Failed to delete branch");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not delete branch");
    }
  };

  //  Separate active and pending branches
  const activeBranches = enrichedBranches.filter((b) => b.status === "active" || b.status === "inactive");
  const pendingRequests = enrichedBranches.filter((b) => b.status === "pending");


  // Pagination helpers
  const paginate = (data, page) => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  };

  const totalPendingPages = Math.ceil(pendingRequests.length / rowsPerPage);

  const filteredBranches = activeBranches
    .filter((branch) => {
      const term = searchTerm.toLowerCase();

      return (
        (branch.company || "").toLowerCase().includes(term) ||   // ✅ branch name
        (branch.contact_person || "").toLowerCase().includes(term) || // ✅ owner
        (branch.city || "").toLowerCase().includes(term) || // ✅ place
        (branch.phone || "").toLowerCase().includes(term) || // ✅ phone number
        (branch.status || "").toLowerCase().includes(term) // ✅ status
      );
    })
    .filter((branch) => {
      if (statusFilter === "all") return true;
      return branch.status === statusFilter;
    });


  const totalActivePages = Math.ceil(filteredBranches.length / rowsPerPage);



  return (
    <div className="branch-management-container">
      <h2>Branch Management</h2>

      {loading ? (
        <p>Loading branches...</p>
      ) : (
        <>
          {/* Branch Requests Table */}
          <h3>Branch Requests</h3>
          <table className="branch-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Request From</th>
                <th>City</th>
                <th>Request Date</th>
                <th>View Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan="6">No pending requests.</td>
                </tr>
              ) : (
                paginate(pendingRequests, pendingPage).map((branch, idx) => (
                  <tr key={branch.id}>
                    {/* S.No calculation for pagination */}
                    <td>{(pendingPage - 1) * rowsPerPage + idx + 1}</td>
                    <td>{branch.company}</td>
                    <td>{branch.city}</td>
                    <td>
                      {new Date(branch.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <button className="branch-view-details-btn" onClick={() => openModal(branch)}>
                        View
                      </button>
                    </td>
                    <td>
                      <button className="approve-btn" onClick={() => toggleStatus(branch.id, branch.status)}>
                        Approve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
          {totalPendingPages > 1 && (

            < td colSpan="5" className="pagination-cell">
              <ChevronLeft
                size={20}
                className={`pagination-btn left-btn ${pendingPage === 1 ? "disabled-btn" : ""}`}
                onClick={() => pendingPage > 1 && setPendingPage(pendingPage - 1)}
              />

              {Array.from({ length: totalPendingPages }, (_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPendingPages ||
                  (page >= pendingPage - 1 && page <= pendingPage + 1)
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => setPendingPage(page)}
                      className={`pagination-btn ${pendingPage === page ? "active-page-btn" : ""}`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === pendingPage - 2 || page === pendingPage + 2) {
                  return <span key={i} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}

              <ChevronRight
                size={20}
                className={`pagination-btn right-btn ${pendingPage === totalPendingPages ? "disabled-btn" : ""}`}
                onClick={() => pendingPage < totalPendingPages && setPendingPage(pendingPage + 1)}
              />
            </td>
          )}


          {showModal && selectedBranch && (
            <div className="branch-modal-overlay" onClick={closeModal}>

              <div className="branch-modal-content" onClick={(e) => e.stopPropagation()}>
                <X size={22} className="branch-close-button" onClick={closeModal} />

                <div className="branch-details-header">

                  <h3 className="gst-details">GST Details</h3>
                  <h3 className="contact-details">Contact Details</h3>
                </div>

                <div className="branch-details-container">
                  {/* Left Side - 7 Fields */}

                  <div className="branch-details-column">

                    <div className="detail-item"><strong>GSTIN</strong> <span>{selectedBranch.gstin}</span></div>
                    <div className="detail-item"><strong>Trade Name</strong> <span>{selectedBranch.branch_name}</span></div>
                    <div className="detail-item"><strong>Legal Name</strong> <span>{selectedBranch.owner_name}</span></div>
                    <div className="detail-item"><strong>Address</strong> <span>{selectedBranch.address}</span></div>
                    <div className="detail-item"><strong>City</strong> <span>{selectedBranch.city}</span></div>
                    <div className="detail-item"><strong>State</strong> <span>{selectedBranch.state}</span></div>
                    <div className="detail-item"><strong>Country</strong> <span>{selectedBranch.country}</span></div>
                    <div className="detail-item"><strong>Pincode</strong> <span>{selectedBranch.pincode}</span></div>
                  </div>

                  {/* Right Side - 7 Fields */}
                  <div className="branch-details-column">
                    <div className="detail-item"><strong>Company</strong> <span>{selectedBranch.company}</span></div>
                    <div className="detail-item"><strong>Contact Person</strong> <span>{selectedBranch.contact_person}</span></div>
                    <div className="detail-item"><strong>Phone</strong> <span>{selectedBranch.phone}</span></div>
                    <div className="detail-item"><strong>Email</strong> <span>{selectedBranch.email}</span></div>
                    <div className="detail-item"><strong>Place</strong> <span>{selectedBranch.place || "-"}</span></div>
                    {/* <div className="detail-item"><strong>Status</strong> <span style={{color:'red'}}>Waiting for approval</span></div> */}
                    <div className="detail-item"><strong>Status</strong> <span>{selectedBranch.status}</span></div>
                    <div className="detail-item"><strong>Requested Date</strong>
                      <span>
                        {new Date(selectedBranch.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Active Branches Table */}
          <h3>All Branches</h3>
          <div className="table-filters">


            <div className="table-status-filter">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All </option>
                <option value="active">Active Branches</option>
                <option value="inactive">Inactive Branches</option>
              </select>
            </div>
            <div className="table-search-container">
              <Search size={18} className="branch-search-icon" />
              <input
                type="text"
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <X size={18} className="search-clear-icon" onClick={() => setSearchTerm("")} />
              )}
            </div>
          </div>

          <table className="branch-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Branch Name</th>
                <th>Owner</th>
                <th>Phone</th>
                <th>Place</th>
                <th>Joined Date</th>
                <th>No. of Products</th>
                <th>Waiting For Approval</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan="10">No branches found.</td>
                </tr>
              ) : (
                paginate(filteredBranches, activePage).map((branch, idx) => (
                  <tr key={branch.id}>
                    <td>{(activePage - 1) * rowsPerPage + idx + 1}</td>
                    <td>{branch.company}</td>
                    <td>{branch.contact_person}</td>
                    <td>{branch.phone}</td>
                    <td>{branch.city}</td>
                    <td>{new Date(branch.joined_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}</td>
                    <td>
                      {branch.no_of_products > 0 ? (
                        <>
                          {branch.no_of_products}
                          <Box
                            size={18}
                            style={{ cursor: "pointer", verticalAlign: "middle", marginLeft: "5px" }}
                            onClick={() => openProductModal(branch.id)}
                          />
                        </>
                      ) : '-'}
                    </td>
                    <td>
                      {branch.approval_waiting_products > 0 ? (
                        <>
                          {branch.approval_waiting_products}{" "}

                          <Box
                            size={18}
                            style={{ cursor: "pointer", verticalAlign: "middle", marginLeft: "5px" }}
                            onClick={() => openProductModal(branch.id, "unapproved", "These products are waiting for your approval")}
                          />
                        </>
                      ) : '-'}
                    </td>
                    <td>
                      <span
                        className={`branch-status-badge ${branch.status}`}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() => toggleStatus(branch.id, branch.status)}
                      >
                        {branch.status}
                      </span>
                    </td>
                    <td>
                      <button className="branch-delete-btn" onClick={() => deleteBranch(branch.id)}>
                        Delete
                      </button>
                    </td>
                    <td>
                      <button className="branch-view-details-btn" onClick={() => openModal(branch)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>



          </table>

          {totalActivePages > 1 && (
            <td colSpan="5" className="pagination-cell">
              <ChevronLeft
                size={20}
                className={`pagination-btn left-btn ${activePage === 1 ? "disabled-btn" : ""}`}
                onClick={() => activePage > 1 && setActivePage(activePage - 1)}
              />

              {Array.from({ length: totalActivePages }, (_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalActivePages ||
                  (page >= activePage - 1 && page <= activePage + 1)
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => setActivePage(page)}
                      className={`pagination-btn ${activePage === page ? "active-page-btn" : ""}`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === activePage - 2 || page === activePage + 2) {
                  return <span key={i} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}

              <ChevronRight
                size={20}
                className={`pagination-btn right-btn ${activePage === totalActivePages ? "disabled-btn" : ""}`}
                onClick={() => activePage < totalActivePages && setActivePage(activePage + 1)}
              />
            </td>
          )}


          {showProductModal && (
            <div className="branch-modal-overlay" onClick={closeProductModal}>
              <div className="product-modal-content" onClick={e => e.stopPropagation()}>
                <X size={22} className="branch-close-button" onClick={closeProductModal} />
                <div className="modal-header-bar">
                  <h3>{title || "Total products in this branch"}</h3>

                  {title && (
                    <div className="modal-header-actions">


                      {showBulkApprove && selectedIds.length > 0 && (
                        <button
                          className="approve-submit-btn"
                          onClick={() => handleApprove(selectedIds)}
                        >
                          Approve ({selectedIds.length})
                        </button>
                      )}

                      <button
                        className="approve-toggle-btn"
                        onClick={() => setShowBulkApprove(!showBulkApprove)}
                      >
                        {showBulkApprove ? "Cancel" : "Click to Approve"}
                      </button>
                    </div>
                  )}
                </div>


                {selectedProducts.length === 0 ? (
                  <p>No products found.</p>
                ) : (
                  <table className="branch-table">
                    <thead>
                      <tr>
                        {showBulkApprove && (
                          <th>
                            <input
                              type="checkbox"
                              checked={selectedIds.length === selectedProducts.length && selectedProducts.length > 0}
                              onChange={(e) => {
                                setSelectedIds(e.target.checked ? selectedProducts.map(p => p.prod_id) : []);
                              }}
                            />
                          </th>

                        )}
                        <th>S.No</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>M.R.P Price</th>
                        <th>Sale Price</th>
                        {/* <th>Offer Label</th> */}
                        <th>Offer Price</th>
                        <th>Delivery Charge</th>
                        {/* <th>Additional Accessories</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.map((p, idx) => (
                        <tr key={p.id}>
                          {showBulkApprove && (
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(p.prod_id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedIds([...selectedIds, p.prod_id]);
                                  } else {
                                    setSelectedIds(selectedIds.filter(x => x !== p.prod_id));
                                  }
                                }}
                              />

                            </td>
                          )}
                          <td>{(currentPage - 1) * tableRowsPerPage + idx + 1}</td>
                          <td title={p.prod_name}>
                            {p.prod_name.length > 50 ? `${p.prod_name.slice(0, 50)}...` : p.prod_name}
                          </td>
                          <td>{p.category}</td>
                          <td>{p.productStatus}</td>
                          <td>{p.actual_price}</td>
                          <td>{p.prod_price}</td>
                          <td>{p.offer_price || 0}</td>
                          <td>{p.deliverycharge || 0}</td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                )}


                {totalPages > 1 && (
                  <div className="pagination-cell">

                    {/* previous button */}
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="page-btn"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* page numbers */}
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    {/* next button */}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="page-btn"
                    >
                      <ChevronRight size={16} />
                    </button>

                  </div>
                )}

              </div>


            </div>
          )}


        </>
      )
      }
    </div >
  );
};

export default BranchManagement;
