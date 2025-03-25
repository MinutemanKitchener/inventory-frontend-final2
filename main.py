from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI()

# In-memory storage
inventory = [
    {"id": 1, "item": "Gloss Label Roll", "quantity": 100, "reserved": 10},
    {"id": 2, "item": "Matte Cover Sheet", "quantity": 200, "reserved": 0}
]

audit_log = []

# Models
class InventoryItem(BaseModel):
    id: int
    item: str
    quantity: int
    reserved: int

class LoanRequest(BaseModel):
    item_id: int
    quantity: int
    to_location: str

class ReturnRequest(BaseModel):
    item_id: int
    quantity: int
    from_location: str

@app.get("/")
def read_root():
    return {"message": "Inventory System backend is running"}

@app.get("/inventory", response_model=List[InventoryItem])
def get_inventory():
    return inventory

@app.post("/loan")
def loan_item(req: LoanRequest):
    for item in inventory:
        if item["id"] == req.item_id:
            if item["quantity"] >= req.quantity:
                item["quantity"] -= req.quantity
                item["reserved"] += req.quantity
                audit_log.append({
                    "action": "loan",
                    "item": item["item"],
                    "quantity": req.quantity,
                    "to": req.to_location,
                    "timestamp": datetime.now().isoformat()
                })
                return {"message": "Item loaned"}
            else:
                raise HTTPException(status_code=400, detail="Not enough stock")
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/return")
def return_item(req: ReturnRequest):
    for item in inventory:
        if item["id"] == req.item_id:
            item["quantity"] += req.quantity
            item["reserved"] -= min(req.quantity, item["reserved"])
            audit_log.append({
                "action": "return",
                "item": item["item"],
                "quantity": req.quantity,
                "from": req.from_location,
                "timestamp": datetime.now().isoformat()
            })
            return {"message": "Item returned"}
    raise HTTPException(status_code=404, detail="Item not found")

@app.get("/audit-log")
def get_audit_log():
    return audit_log