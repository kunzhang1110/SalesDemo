using System;
using System.Collections.Generic;

namespace SalesDemo.Models
{
    public partial class Product
    {
        public Product()
        {
            Sale = new HashSet<Sale>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public double? Price { get; set; }

        public ICollection<Sale> Sale { get; set; }
    }
}
