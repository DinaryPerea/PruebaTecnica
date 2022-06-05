using BookCart.Dto;
using BookCart.Interfaces;
using BookCart.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BookCart.DataAccess
{
    public class ProductoDataAccessLayer : IProductoService
    {
        readonly ProductoContext _dbContext;

        public ProductoDataAccessLayer(ProductoContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Producto> GetAllProductos()
        {
            try
            {
                return _dbContext.Producto.AsNoTracking().ToList();
            }
            catch
            {
                throw;
            }
        }

        public int AddProducto(Producto book)
        {
            try
            {
                _dbContext.Producto.Add(book);
                _dbContext.SaveChanges();

                return 1;
            }
            catch
            {
                throw;
            }
        }

        public int UpdateProducto(Producto book)
        {
            try
            {
                Producto oldBookData = GetProductoData(book.ProductoId);

                if (oldBookData.CoverFileName != null)
                {
                    if (book.CoverFileName == null)
                    {
                        book.CoverFileName = oldBookData.CoverFileName;
                    }
                }

                _dbContext.Entry(book).State = EntityState.Modified;
                _dbContext.SaveChanges();

                return 1;
            }
            catch
            {
                throw;
            }
        }

        public Producto GetProductoData(int bookId)
        {
            try
            {
                Producto book = _dbContext.Producto.FirstOrDefault(x => x.ProductoId == bookId);
                if (book != null)
                {
                    _dbContext.Entry(book).State = EntityState.Detached;
                    return book;
                }
                return null;
            }
            catch
            {
                throw;
            }
        }

        public string DeleteProducto(int bookId)
        {
            try
            {
                Producto book = _dbContext.Producto.Find(bookId);
                _dbContext.Producto.Remove(book);
                _dbContext.SaveChanges();

                return (book.CoverFileName);
            }
            catch
            {
                throw;
            }
        }

        public List<Categories> GetCategories()
        {
            List<Categories> lstCategories = new List<Categories>();
            lstCategories = (from CategoriesList in _dbContext.Categories select CategoriesList).ToList();

            return lstCategories;
        }

        public List<Producto> GetSimilarProductos(int bookId)
        {
            List<Producto> lstBook = new List<Producto>();
            Producto book = GetProductoData(bookId);

            lstBook = _dbContext.Producto.Where(x => x.Category == book.Category && x.ProductoId != book.ProductoId)
                .OrderBy(u => Guid.NewGuid())
                .Take(5)
                .ToList();
            return lstBook;
        }

        public List<CartItemDto> GetProductosAvailableInCart(string cartID)
        {
            try
            {
                List<CartItemDto> cartItemList = new List<CartItemDto>();
                List<CartItems> cartItems = _dbContext.CartItems.Where(x => x.CartId == cartID).ToList();

                foreach (CartItems item in cartItems)
                {
                    Producto book = GetProductoData(item.ProductId);
                    CartItemDto objCartItem = new CartItemDto
                    {
                        Book = book,
                        Quantity = item.Quantity
                    };

                    cartItemList.Add(objCartItem);
                }
                return cartItemList;
            }
            catch
            {
                throw;
            }
        }

        public List<Producto> GetProductosAvailableInWishlist(string wishlistID)
        {
            try
            {
                List<Producto> wishlist = new List<Producto>();
                List<WishlistItems> cartItems = _dbContext.WishlistItems.Where(x => x.WishlistId == wishlistID).ToList();

                foreach (WishlistItems item in cartItems)
                {
                    Producto book = GetProductoData(item.ProductId);
                    wishlist.Add(book);
                }
                return wishlist;
            }
            catch
            {
                throw;
            }
        }
    }
}
