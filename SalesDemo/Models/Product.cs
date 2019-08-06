using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesDemo.Models
{
    public partial class Product
    {
        public Product()
        {
            Sale = new HashSet<Sale>();
        }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public double? Price { get; set; }

        public ICollection<Sale> Sale { get; set; }
    }
}
