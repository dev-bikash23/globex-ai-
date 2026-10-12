package com.globex.trip.dto.request;
import java.util.List;
public record ReorderItemsRequest(List<ItemOrder> items) {
    public record ItemOrder(String itemId, int sortOrder) {}
}
