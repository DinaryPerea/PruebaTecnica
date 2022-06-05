using BookCart.Dto;
using BookCart.Models;
using System.Collections.Generic;

namespace BookCart.Interfaces
{
    public interface IProductoService
    {
        List<Producto> GetAllProductos();
        int AddProducto(Producto producto);
        int UpdateProducto(Producto producto);
        Producto GetProductoData(int productoId);
        string DeleteProducto(int productoId);
        List<Categories> GetCategories();
        List<Producto> GetSimilarProductos(int productoId);
        List<CartItemDto> GetProductosAvailableInCart(string cartId);
        List<Producto> GetProductosAvailableInWishlist(string wishlistID);
    }
}
