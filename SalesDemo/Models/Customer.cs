using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesDemo.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Sale = new HashSet<Sale>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        public string Address { get; set; }

        public ICollection<Sale> Sale { get; set; }
    }
}
