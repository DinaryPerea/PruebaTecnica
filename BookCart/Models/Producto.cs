using System;
using System.Collections.Generic;

namespace BookCart.Models
{
    public partial class Producto
    {
        public int ProductoId { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public string CoverFileName { get; set; }
    }
}
