import { describe, it, expect, beforeEach } from "vitest"
import { useCartStore } from "../cart-store"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
    })
  })

  describe("addItem", () => {
    it("adds a new item to the cart", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })

      const items = useCartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0]).toEqual({
        id: "1",
        name: "Test Product",
        price: 10,
        quantity: 1,
      })
    })

    it("increases quantity when adding an existing item", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })

      const items = useCartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it("handles multiple different items", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Product A",
        price: 10,
      })
      useCartStore.getState().addItem({
        id: "2",
        name: "Product B",
        price: 20,
      })

      const items = useCartStore.getState().items
      expect(items).toHaveLength(2)
      expect(items[0].id).toBe("1")
      expect(items[1].id).toBe("2")
    })
  })

  describe("removeItem", () => {
    it("removes an item when quantity is 1", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })
      useCartStore.getState().removeItem("1")

      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it("decreases quantity when quantity is greater than 1", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })
      useCartStore.getState().removeItem("1")

      const items = useCartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(1)
    })

    it("does nothing when item does not exist", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })
      useCartStore.getState().removeItem("nonexistent")

      expect(useCartStore.getState().items).toHaveLength(1)
    })
  })

  describe("clearCart", () => {
    it("removes all items from the cart", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Product A",
        price: 10,
      })
      useCartStore.getState().addItem({
        id: "2",
        name: "Product B",
        price: 20,
      })
      useCartStore.getState().clearCart()

      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it("works on an already empty cart", () => {
      useCartStore.getState().clearCart()

      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe("total", () => {
    it("returns 0 for an empty cart", () => {
      expect(useCartStore.getState().total).toBe(0)
    })

    it("returns the price of a single item", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 25,
      })

      expect(useCartStore.getState().total).toBe(25)
    })

    it("calculates quantity * price correctly", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })
      useCartStore.getState().addItem({
        id: "1",
        name: "Test Product",
        price: 10,
      })

      expect(useCartStore.getState().total).toBe(30)
    })

    it("sums multiple different items", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Product A",
        price: 15,
      })
      useCartStore.getState().addItem({
        id: "2",
        name: "Product B",
        price: 25,
      })

      expect(useCartStore.getState().total).toBe(40)
    })

    it("updates total after removing an item", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Product A",
        price: 10,
      })
      useCartStore.getState().addItem({
        id: "2",
        name: "Product B",
        price: 20,
      })
      useCartStore.getState().removeItem("1")

      expect(useCartStore.getState().total).toBe(20)
    })

    it("updates total after clearing the cart", () => {
      useCartStore.getState().addItem({
        id: "1",
        name: "Product A",
        price: 10,
      })
      useCartStore.getState().clearCart()

      expect(useCartStore.getState().total).toBe(0)
    })
  })
})
