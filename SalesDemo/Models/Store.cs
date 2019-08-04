using System.Collections.Generic;

namespace SalesDemo.Models
{
    public partial class Store
    {
        public Store()
        {
            Sale = new HashSet<Sale>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        public ICollection<Sale> Sale { get; set; }
    }
}
