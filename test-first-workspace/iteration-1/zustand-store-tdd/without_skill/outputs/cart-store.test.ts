import { describe, it, expect, beforeEach } from "vitest"
import { useCartStore } from "./cart-store"

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  describe("items", () => {
    it("starts as an empty array", () => {
      const { items } = useCartStore.getState()
      expect(items).toEqual([])
    })
  })

  describe("addItem", () => {
    it("adds a new item to the cart", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({
        id: "1",
        name: "T-Shirt",
        price: 19.99,
        quantity: 1,
      })
    })

    it("increments quantity when adding an existing item", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it("accepts an optional quantity parameter", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 }, 3)
      const { items } = useCartStore.getState()
      expect(items[0].quantity).toBe(3)
    })

    it("does not affect other items when adding", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      useCartStore.getState().addItem({ id: "2", name: "Hat", price: 9.99 })
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(2)
      expect(items[0].id).toBe("1")
      expect(items[1].id).toBe("2")
    })

    it("does not mutate the previous state", () => {
      const prevState = useCartStore.getState().items
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      const nextState = useCartStore.getState().items
      expect(prevState).not.toBe(nextState)
    })
  })

  describe("removeItem", () => {
    it("removes an item from the cart by id", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      useCartStore.getState().removeItem("1")
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(0)
    })

    it("removes only the specified item", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      useCartStore.getState().addItem({ id: "2", name: "Hat", price: 9.99 })
      useCartStore.getState().removeItem("1")
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].id).toBe("2")
    })

    it("does nothing when the item id does not exist", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      useCartStore.getState().removeItem("non-existent")
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
    })
  })

  describe("clearCart", () => {
    it("removes all items from the cart", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      useCartStore.getState().addItem({ id: "2", name: "Hat", price: 9.99 })
      useCartStore.getState().clearCart()
      const { items } = useCartStore.getState()
      expect(items).toEqual([])
    })

    it("is safe to call on an already empty cart", () => {
      useCartStore.getState().clearCart()
      const { items } = useCartStore.getState()
      expect(items).toEqual([])
    })
  })

  describe("total", () => {
    it("is 0 when the cart is empty", () => {
      const { total } = useCartStore.getState()
      expect(total).toBe(0)
    })

    it("returns the sum of price * quantity for a single item", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      const { total } = useCartStore.getState()
      expect(total).toBeCloseTo(19.99, 2)
    })

    it("returns the sum of price * quantity for multiple items", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      useCartStore.getState().addItem({ id: "2", name: "Hat", price: 9.99 })
      const { total } = useCartStore.getState()
      expect(total).toBeCloseTo(29.98, 2)
    })

    it("accounts for quantities greater than 1", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 10.0 }, 3)
      const { total } = useCartStore.getState()
      expect(total).toBe(30)
    })

    it("updates after removing an item", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      useCartStore.getState().addItem({ id: "2", name: "Hat", price: 9.99 })
      useCartStore.getState().removeItem("1")
      const { total } = useCartStore.getState()
      expect(total).toBeCloseTo(9.99, 2)
    })

    it("updates after clearing the cart", () => {
      useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 19.99 })
      useCartStore.getState().clearCart()
      const { total } = useCartStore.getState()
      expect(total).toBe(0)
    })
  })
})
