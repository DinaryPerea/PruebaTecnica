using BookCart.Models;

namespace BookCart.Dto
{
    public class CartItemDto
    {
        public Producto Book { get; set; }
        public int Quantity { get; set; }
    }
}
